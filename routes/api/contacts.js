const express = require('express');
const router = express.Router();
const {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
} = require('../../controllers/contacts');
const { validateContact, validateUpdate } = require('../../middlewares/validation');

router.get('/', listContacts);

router.get('/:id', getById);

router.post('/', validateContact, addContact);

router.delete('/:id', removeContact);

router.put('/:id', validateUpdate, updateContact);

module.exports = router;
