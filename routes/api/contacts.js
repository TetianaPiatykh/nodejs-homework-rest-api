const express = require('express')

const router = express.Router();
var createError = require('http-errors');

const Contact = require('../../models/contacts');
const addSchema = require('../../shemas/addSchema');
const updateShema = require('../../shemas/updateShema');
const updateFavoriteSchema = require('../../shemas/updateFavoriteSchema');
const { validation, authenticate } = require('../../middlewares');
const ctrl = require('../../controllers/contact');


router.get('/', authenticate, ctrl.getAll);

router.get('/:contactId', authenticate, ctrl.getById);

router.post('/', authenticate, validation(addSchema), ctrl.addContact);

router.delete('/:contactId', authenticate, ctrl.deleteById);

router.put('/:contactId', authenticate, validation(updateShema), ctrl.updateById);

router.patch('/:contactId/favorite', authenticate, validation(updateFavoriteSchema), ctrl.updateFavorite);

module.exports = router;
