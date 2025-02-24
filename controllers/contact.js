const  Contact = require('../models/contacts')

const { ctrlWrapper } = require('../middlewares')
var createError = require('http-errors');

const getAll = async (req, res, next) => {
    const {_id: owner} = req.user;    
    const {page = 1, limit = 10} = req.query;
    const skip = (page - 1) * limit;
    const contacts = await Contact.find({owner}, "-createdAt -updatedAt", {skip, limit});
    res.status(200).json({ contacts })
};

const getById = async (req, res, next) => {
    const id = req.params.contactId;
    const contact = await Contact.findById(id);
    if(!contact) {
        throw createError(404, 'Not found')
    }

    res.status(200).json({contact});
};

const addContact = async (req, res, next) => {
    const {_id: owner} = req.user;
    const result = await Contact.create({...req.body, owner});
    res.status(200).json(result)
};

const updateById = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
        new: true,
    });
    if (!result) {
        throw createError(404, 'Not found');
    }
    res.status(200).json(result);
};

const updateFavorite = async (req, res, next) => {
    const { contactId } = req.params;
    const { favorite } = req.body;
    const result = await Contact.findByIdAndUpdate(contactId, { favorite },{ new: true, });
    if (!result) {
        throw createError(404, 'Not found');
    }
    res.status(200).json(result);
};


const deleteById = async (req, res, next) => {
    const id = req.params.contactId;
    const contact = await Contact.findByIdAndRemove(id);
    if(!contact) {
        throw createError(404, 'Not found')
    }

    res.status(200).json({ message: 'contact deleted' });
};



module.exports = {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    addContact: ctrlWrapper(addContact),
    updateById: ctrlWrapper(updateById),
    updateFavorite: ctrlWrapper(updateFavorite),
    deleteById: ctrlWrapper(deleteById),
}