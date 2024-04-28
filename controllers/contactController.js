const contactsService = require('../services/contactsService');

exports.listContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts();
    res.json({ status: 'success', code: 200, data: { contacts } });
  } catch (e) {
    next(e);
  }
};

exports.getContactById = async (req, res, next) => {
  try {
    const contact = await contactsService.getContactById(req.params.contactId);
    if (contact) {
      res.json({ status: 'success', code: 200, data: { contact } });
    } else {
      res.status(404).json({ status: 'error', code: 404, message: 'Not found', data: 'Not Found' });
    }
  } catch (e) {
    next(e);
  }
};

exports.addContact = async (req, res, next) => {
  try {
    const newContact = await contactsService.addContact(req.body);
    res.status(201).json({ status: 'success', code: 201, data: { newContact } });
  } catch (e) {
    next(e);
  }
};

exports.updateContact = async (req, res, next) => {
  try {
    const updatedContact = await contactsService.updateContact(req.params.contactId, req.body);
    if (updatedContact) {
      res.json({ status: 'success', code: 200, data: { updatedContact } });
    } else {
      res.status(404).json({ status: 'error', code: 404, message: 'Not found', data: 'Not Found' });
    }
  } catch (e) {
    next(e);
  }
};

exports.removeContact = async (req, res, next) => {
  try {
    const contact = await contactsService.removeContact(req.params.contactId);
    if (contact) {
      res.json({ status: 'success', code: 200, message: 'Contact deleted' });
    } else {
      res.status(404).json({ status: 'error', code: 404, message: 'Not found', data: 'Not Found' });
    }
  } catch (e) {
    next(e);
  }
};

exports.updateFavoriteStatus = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;

    if (favorite === undefined) {
      return res.status(400).json({ message: 'missing field favorite' });
    }

    const updatedContact = await contactsService.updateStatusContact(contactId, { favorite });

    if (!updatedContact) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.status(200).json(updatedContact);
  } catch (e) {
    next(e);
  }
};