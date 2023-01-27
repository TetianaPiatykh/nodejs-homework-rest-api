const jwt = require("jsonwebtoken");
const User = require('../models/user');
var createError = require('http-errors');

const {SECRET_KEY} = process.env;

const authenticate = async (req, res, next) => {

    const {authorization = ""} = req.headers;
    const [bearer, token] = authorization.split(" ");

    if(bearer !== "Bearer") {
        next(createError(401))
    }

    try {
        const {id} = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(id);
        if(!user || !user.token || token !== String(user.token)) {
            next(createError(401))
        }
        req.user = user;
        next();
    }
    catch {
        next(createError(401))
    }
}

module.exports = authenticate;