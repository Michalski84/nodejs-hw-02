const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const contactsRouter = require('./routes/api/contacts');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());

app.use('/api', contactsRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

module.exports = app;
