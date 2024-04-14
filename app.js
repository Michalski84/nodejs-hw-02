const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const { listContacts, getContactById, addContact, removeContact, updateContact } = require('./models/contacts');

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());

app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await listContacts();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Unable to list contacts' });
  }
});

app.get('/api/contacts/:id', async (req, res) => {
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

app.post('/api/contacts', async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'missing required name, email, or phone field' });
  }
  try {
    const contact = await addContact({ name, email, phone });
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Unable to add contact' });
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await removeContact(id);
    if (result) {
      res.json({ message: 'contact deleted' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete contact' });
  }
});

app.put('/api/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'missing fields' });
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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

module.exports = app;
