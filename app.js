const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const contactsRouter = require('./routes/api/contacts');
const mongoose = require('mongoose');

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://Andrzej:Muchomor@cluster0.clqhoh7.mongodb.net/db-contacts', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Connection error:', error.message);
  process.exit(1);
});

db.once('open', () => {
  console.log('Database connection successful');
});

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Contact = mongoose.model('Contact', contactSchema);

app.use('/api', contactsRouter(Contact)); 

app.patch('/api/contacts/:id/favorite', async (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;
  
  if (favorite === undefined) {
    return res.status(400).json({ message: 'missing field favorite' });
  }

  try {
    const contact = await Contact.findByIdAndUpdate(id, { favorite }, { new: true }).select('-__v');
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Unable to update favorite status' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

module.exports = app;