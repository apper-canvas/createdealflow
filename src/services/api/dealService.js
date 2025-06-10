import dealsData from '../mockData/deals.json';

// Utility function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage (simulates a database)
let deals = [...dealsData];

const dealService = {
  async getAll() {
    await delay(300);
    return [...deals];
  },

  async getById(id) {
    await delay(200);
    const deal = deals.find(d => d.id === id);
    if (!deal) {
      throw new Error('Deal not found');
    }
    return { ...deal };
  },

  async create(dealData) {
    await delay(400);
    const newDeal = {
      id: Date.now().toString(),
      ...dealData,
      contactIds: dealData.contactIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      closedAt: dealData.stage === 'closed-won' || dealData.stage === 'closed-lost' 
        ? new Date().toISOString() 
        : null
    };
    deals.push(newDeal);
    return { ...newDeal };
  },

  async update(id, updateData) {
    await delay(350);
    const index = deals.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error('Deal not found');
    }
    
    const wasOpen = deals[index].stage !== 'closed-won' && deals[index].stage !== 'closed-lost';
    const isClosing = updateData.stage === 'closed-won' || updateData.stage === 'closed-lost';
    
    deals[index] = {
      ...deals[index],
      ...updateData,
      contactIds: updateData.contactIds || deals[index].contactIds || [],
      updatedAt: new Date().toISOString(),
      closedAt: wasOpen && isClosing ? new Date().toISOString() : deals[index].closedAt
    };
    return { ...deals[index] };
  },

  async delete(id) {
    await delay(300);
    const index = deals.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error('Deal not found');
    }
    deals.splice(index, 1);
    return { success: true };
  }
};

export default dealService;