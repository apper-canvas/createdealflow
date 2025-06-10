import contactsData from '../mockData/contacts.json';

// Utility function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage (simulates a database)
let contacts = [...contactsData];

const contactService = {
  async getAll() {
    await delay(300);
    return [...contacts];
  },

  async getById(id) {
    await delay(200);
    const contact = contacts.find(c => c.id === id);
    if (!contact) {
      throw new Error('Contact not found');
    }
    return { ...contact };
  },

  async create(contactData) {
    await delay(400);
    const newContact = {
      id: Date.now().toString(),
      ...contactData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    contacts.push(newContact);
    return { ...newContact };
  },

  async update(id, updateData) {
    await delay(350);
    const index = contacts.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Contact not found');
    }
    contacts[index] = {
      ...contacts[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    return { ...contacts[index] };
  },

  async delete(id) {
    await delay(300);
    const index = contacts.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Contact not found');
    }
    contacts.splice(index, 1);
    return { success: true };
  }
};

export default contactService;