const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const fs = require('fs/promises');
const path = require('path');
const Jimp = require("jimp");
const {nanoid} = require('nanoid');
const sendEmail = require('../helpers/sendEmail');

const User = require('../models/user');
const { ctrlWrapper } = require('../middlewares');

var createError = require('http-errors');

const {SECRET_KEY, BASE_URL} = process.env;

const signup = async(req, res) => {
    const {email, password, subscription} = req.body;
    const user = await User.findOne({email});
    if(user) {
        throw createError(409, "Email in use")
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const avatarURL = gravatar.url(email);

    const verificationToken = nanoid();

    const newUser = await User.create({email, password: hashPassword, subscription, avatarURL, verificationToken});


    const verifyEmail = {
        to: email,
        subject: 'Verify email',
        html: `<a target='_blank' href='${BASE_URL}/api/auth/verify/${verificationToken}'>Click verify email</a>`
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
        status: "success",
        code: 201,
        user: {
            result: {
                email,
                password,
                subscription,
            },
        },
    })
};

const verify = async(req, res)=> {
    const {verificationToken} = req.params;
    const user = await User.findOne({verificationToken});
    if(!user) {
        throw createError(404);
    }

    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null});

    res.json({
        message: "Verify success"
    })
};

const reVerify = async(req, res)=> {
    const {verificationToken} = req.params;
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw createError(400, "missing required field email");
    };

    if(user.verify) {
        throw createError(400, "Verification has already been passed");
    }

    const verifyEmail = {
        to: email,
        subject: 'Verify email',
        html: `<a target='_blank' href='${BASE_URL}/api/auth/verify/${verificationToken}'>Click verify email</a>`
    };

    await sendEmail(verifyEmail);

    res.json({
        message: "Verification email sent"
    })
}

const login = async(req, res)=> {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw createError(401, "Email or password invalid");
    }

    if(!user.verify){
        throw createError(401, "Email or password invalid");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw createError(401, "Email or password invalid");
    }

    const payload = {
        id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});
    await User.findByIdAndUpdate(user._id, {token})

    res.json({
        token, 
        user: {
            email,
            subscription: user.subscription,
            },
    })
}

const getCurrent = async (req, res) => {

    const {email, name} = req.user;
    res.json({
        email,
        name
    })
};

const logout = async(req, res)=> {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});

    res.json({
        message: "Logout success"
    })
};

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

async function resizeAvatar(path) {
    const image = await Jimp.read(path);
    image.resize(250, 250);
    await image.writeAsync(path);
};


const updateAvatar = async(req, res)=> {
    const {_id} = req.user;
    const {path: tempUpload, filename} = req.file;
    const newFileName = `${_id}_${filename}`;

    try {
        await resizeAvatar(tempUpload);
        const resultUpload = path.join(avatarsDir, newFileName);
        await fs.rename(tempUpload, resultUpload);
    
        const avatarURL = path.join("avatars", newFileName);
        await User.findByIdAndUpdate(_id, {avatarURL});
        res.json({
            avatarURL
        })
    } catch (error) {
        await fs.unlink(tempUpload);
        throw error;
    }



    res.json({
        avatarURL
    })
}

module.exports = {
    signup: ctrlWrapper(signup),
    verify: ctrlWrapper(verify),
    reVerify: ctrlWrapper(reVerify),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
}