const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const contactsPath = path.join(__dirname, 'contacts.json');

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error('Unable to list contacts');
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    return contacts.find(contact => contact.id === contactId);
  } catch (error) {
    throw new Error('Unable to get contact');
  }
};

const addContact = async (newContact) => {
  try {
    const contacts = await listContacts();
    const id = uuidv4();
    const contactWithId = { id, ...newContact };
    const updatedContacts = [...contacts, contactWithId];
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
    return contactWithId;
  } catch (error) {
    throw new Error('Unable to add contact');
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const updatedContacts = contacts.filter(contact => contact.id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
    return true;
  } catch (error) {
    throw new Error('Unable to delete contact');
  }
};

const updateContact = async (contactId, updatedData) => {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);
    if (index === -1) {
      return null;
    }
    const updatedContact = { ...contacts[index], ...updatedData };
    contacts[index] = updatedContact;
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return updatedContact;
  } catch (error) {
    throw new Error('Unable to update contact');
  }
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
