import companiesData from '../mockData/companies.json';

// Utility function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage (simulates a database)
let companies = [...companiesData];

const companyService = {
  async getAll() {
    await delay(300);
    return [...companies];
  },

  async getById(id) {
    await delay(200);
    const company = companies.find(c => c.id === id);
    if (!company) {
      throw new Error('Company not found');
    }
    return { ...company };
  },

  async create(companyData) {
    await delay(400);
    const newCompany = {
      id: Date.now().toString(),
      ...companyData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    companies.push(newCompany);
    return { ...newCompany };
  },

  async update(id, updateData) {
    await delay(350);
    const index = companies.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Company not found');
    }
    companies[index] = {
      ...companies[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    return { ...companies[index] };
  },

  async delete(id) {
    await delay(300);
    const index = companies.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Company not found');
    }
    companies.splice(index, 1);
    return { success: true };
  }
};

export default companyService;