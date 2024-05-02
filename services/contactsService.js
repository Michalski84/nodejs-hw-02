const Contact = require('../models/contact');

exports.listContacts = async () => {
  return Contact.find({});
};

exports.getContactById = async contactId => {
  return Contact.findById(contactId);
};

exports.addContact = async contactData => {
  return Contact.create(contactData);
};

exports.updateContact = async (contactId, updateData) => {
  return Contact.findByIdAndUpdate(contactId, updateData, { new: true });
};

exports.removeContact = async contactId => {
  return Contact.findByIdAndRemove(contactId);
};

exports.updateStatusContact = async (contactId, update) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { $set: update },
      { new: true }
    );

    return updatedContact;
  } catch (e) {
    return null;
  }
};