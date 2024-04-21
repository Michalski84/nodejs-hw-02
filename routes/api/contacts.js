const express = require('express');
const Joi = require('joi');

function contactsRouter(Contact) {
  const router = express.Router();

  const contactSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(9).required(),
  });

  router.get('/contacts', async (req, res) => {
    try {
      const contacts = await Contact.find();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: 'Unable to list contacts' });
    }
  });

  router.get('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const contact = await Contact.findById(id);
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
      const newContact = { name, email, phone }; 
      const contact = await Contact.create(newContact);
      res.status(201).json(contact);
    } catch (error) {
      res.status(500).json({ message: 'Unable to add contact' });
    }
  });

  router.delete('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await Contact.findByIdAndDelete(id);
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
      const contact = await Contact.findByIdAndUpdate(id, { name, email, phone }, { new: true }).select('-__v');
      if (contact) {
        res.json(contact);
      } else {
        res.status(404).json({ message: 'Not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Unable to update contact' });
    }
  });

  return router;
}

module.exports = contactsRouter;
