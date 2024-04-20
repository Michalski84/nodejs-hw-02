const express = require('express');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require('../../models/contacts');

const router = express.Router();

const contactSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(9).required(),
});

router.get('/contacts', async (req, res) => {
  try {
    const contacts = await listContacts();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Unable to list contacts' });
  }
});

router.get('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await getContactById(id);
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Unable to get contact' });
  }
});

router.post('/contacts', async (req, res) => {
  const { name, email, phone } = req.body;
  
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const newContact = { id: uuidv4(), name, email, phone }; 
    const contact = await addContact(newContact);
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Unable to add contact' });
  }
});

router.delete('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await removeContact(id);
    if (result) {
      res.json({ message: 'Contact deleted' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete contact' });
  }
});

router.put('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const contact = await updateContact(id, { name, email, phone });
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Unable to update contact' });
  }
});

module.exports = router;
