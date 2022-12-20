const express = require('express')

const router = express.Router();
var createError = require('http-errors');

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../../models/contacts');
const { addShema } = require('../../shemas/addShema');
const { updateShema } = require('../../shemas/updateShema');


router.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json({ contacts })
  } catch (err) {
    next(err);
  }
  
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const contact = await getContactById(id);
    if(!contact) {
      throw createError(404, 'Not found')
    }

    res.status(200).json({contact});

  } catch (err) {
    next(err);
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { error } = addShema.validate(req.body);
    if (error) {
      error.status = 400;
      throw error;
    }
    const contacts = await addContact(req.body);
    res.status(201).json({contacts});
  } catch (err) {
    next(err)
  }
  res.json({ message: 'template message' })
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const contact = await removeContact(id);
    if(!contact) {
      throw createError(404, 'Not found')
    }

    res.status(200).json({ message: 'contact deleted' });
  } catch (err) {
    next(err)
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = updateShema.validate(req.body);
    if (error) {
      error.status = 400;
      throw error;
    }
    
    const id = req.params.contactId;
    const result = await updateContact(id, req.body);
    if (!result) {
      throw createError(404, 'Not found')
    }
    res.status(200).json({result});
  } catch (err) {
    next(err)
  }
})

module.exports = router;
