const express = require('express')

const router = express.Router();
var createError = require('http-errors');

const Contact = require('../../models/contacts');
const addSchema = require('../../shemas/addSchema');
const updateShema = require('../../shemas/updateShema');
const updateFavoriteSchema = require('../../shemas/updateFavoriteSchema');
const { validation } = require('../../middlewares');
const ctrl = require('../../controllers/contact');


router.get('/', ctrl.getAll);

router.get('/:contactId', ctrl.getById);

router.post('/', validation(addSchema), ctrl.addContact);

router.delete('/:contactId', ctrl.deleteById);

router.put('/:contactId', validation(updateShema), ctrl.updateById);

router.patch('/:contactId/favorite', validation(updateFavoriteSchema), ctrl.updateFavorite);

module.exports = router;
