import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import dealService from '../services/api/dealService';
import companyService from '../services/api/companyService';
import contactService from '../services/api/contactService';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    stage: 'lead',
    companyId: '',
    contactIds: [],
    notes: ''
  });
  const navigate = useNavigate();

  const dealStages = [
    { value: 'lead', label: 'Lead', color: 'bg-info text-white' },
    { value: 'negotiation', label: 'Negotiation', color: 'bg-warning text-white' },
    { value: 'closed-won', label: 'Closed Won', color: 'bg-success text-white' },
    { value: 'closed-lost', label: 'Closed Lost', color: 'bg-error text-white' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dealsResult, companiesResult, contactsResult] = await Promise.all([
        dealService.getAll(),
        companyService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsResult);
      setCompanies(companiesResult);
      setContacts(contactsResult);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'No Company';
  };

  const getContactNames = (contactIds) => {
    return contactIds.map(id => {
      const contact = contacts.find(c => c.id === id);
      return contact ? `${contact.firstName} ${contact.lastName}` : 'Unknown';
    }).join(', ');
  };

  const getStageInfo = (stage) => {
    return dealStages.find(s => s.value === stage) || dealStages[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dealData = {
        ...formData,
        value: parseFloat(formData.value) || 0
      };
      
      if (editingDeal) {
        await dealService.update(editingDeal.id, dealData);
        toast.success('Deal updated successfully');
      } else {
        await dealService.create(dealData);
        toast.success('Deal created successfully');
      }
      await loadData();
      setShowModal(false);
      setEditingDeal(null);
      setFormData({ title: '', value: '', stage: 'lead', companyId: '', contactIds: [], notes: '' });
    } catch (error) {
      toast.error('Failed to save deal');
    }
  };

  const handleEdit = (deal) => {
    setEditingDeal(deal);
    setFormData({
      title: deal.title,
      value: deal.value.toString(),
      stage: deal.stage,
      companyId: deal.companyId,
      contactIds: deal.contactIds || [],
      notes: deal.notes
    });
    setShowModal(true);
  };

  const handleDelete = async (deal) => {
    if (window.confirm(`Are you sure you want to delete "${deal.title}"?`)) {
      try {
        await dealService.delete(deal.id);
        toast.success('Deal deleted successfully');
        await loadData();
      } catch (error) {
        toast.error('Failed to delete deal');
      }
    }
  };

  const handleContactChange = (contactId, checked) => {
    if (checked) {
      setFormData({
        ...formData,
        contactIds: [...formData.contactIds, contactId]
      });
    } else {
      setFormData({
        ...formData,
        contactIds: formData.contactIds.filter(id => id !== contactId)
      });
    }
  };

  const filteredDeals = deals.filter(deal =>
    deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCompanyName(deal.companyId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getContactNames(deal.contactIds || []).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                <div className="h-4 bg-surface-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-8 text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Error Loading Deals</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-heading font-bold text-surface-900">Deals</h1>
          <p className="text-surface-600">Track your sales opportunities</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-gradient-primary text-white rounded-lg font-medium shadow-sm"
        >
          <ApperIcon name="Plus" size={16} className="inline mr-2" />
          Add Deal
        </motion.button>
      </div>

      {/* Search */}
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={16} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" 
        />
        <input
          type="text"
          placeholder="Search deals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* Deals List */}
      {filteredDeals.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <ApperIcon name="DollarSign" size={48} className="text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">
            {searchTerm ? 'No deals found' : 'No deals yet'}
          </h3>
          <p className="text-surface-600 mb-6">
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : 'Get started by creating your first deal'
            }
          </p>
          {!searchTerm && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-gradient-primary text-white rounded-lg font-medium"
            >
              Create First Deal
            </motion.button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredDeals.map((deal, index) => {
            const stageInfo = getStageInfo(deal.stage);
            return (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-surface-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <ApperIcon name="DollarSign" size={20} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 
                          className="text-lg font-semibold text-surface-900 cursor-pointer hover:text-primary break-words"
                          onClick={() => navigate(`/deals/${deal.id}`)}
                        >
                          {deal.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xl font-bold text-surface-900">
                            ${deal.value.toLocaleString()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${stageInfo.color}`}>
                            {stageInfo.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Building2" size={14} className="text-surface-400" />
                        <span className="text-surface-600 text-sm break-words">
                          {getCompanyName(deal.companyId)}
                        </span>
                      </div>
                      {deal.contactIds && deal.contactIds.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Users" size={14} className="text-surface-400" />
                          <span className="text-surface-600 text-sm break-words">
                            {getContactNames(deal.contactIds)}
                          </span>
                        </div>
                      )}
                      {deal.notes && (
                        <p className="text-surface-600 text-sm break-words mt-2">{deal.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(deal)}
                      className="p-2 text-surface-500 hover:text-primary hover:bg-primary/10 rounded-lg"
                    >
                      <ApperIcon name="Edit" size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(deal)}
                      className="p-2 text-surface-500 hover:text-error hover:bg-error/10 rounded-lg"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => {
                setShowModal(false);
                setEditingDeal(null);
                setFormData({ title: '', value: '', stage: 'lead', companyId: '', contactIds: [], notes: '' });
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-heading font-semibold text-surface-900 mb-4">
                  {editingDeal ? 'Edit Deal' : 'Add New Deal'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Deal Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Enter deal title"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">
                        Value *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">
                        Stage *
                      </label>
                      <select
                        required
                        value={formData.stage}
                        onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        {dealStages.map(stage => (
                          <option key={stage.value} value={stage.value}>
                            {stage.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Company
                    </label>
                    <select
                      value={formData.companyId}
                      onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="">Select a company</option>
                      {companies.map(company => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Contacts
                    </label>
                    <div className="max-h-32 overflow-y-auto border border-surface-300 rounded-lg p-2 space-y-2">
                      {contacts
                        .filter(contact => !formData.companyId || contact.companyId === formData.companyId)
                        .map(contact => (
                          <label key={contact.id} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.contactIds.includes(contact.id)}
                              onChange={(e) => handleContactChange(contact.id, e.target.checked)}
                              className="rounded border-surface-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-surface-700">
                              {contact.firstName} {contact.lastName}
                            </span>
                          </label>
                        ))}
                      {contacts.filter(contact => !formData.companyId || contact.companyId === formData.companyId).length === 0 && (
                        <p className="text-sm text-surface-500 text-center py-2">
                          {formData.companyId ? 'No contacts for selected company' : 'Select a company to see contacts'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Additional notes about the deal"
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-lg font-medium"
                    >
                      {editingDeal ? 'Update' : 'Create'} Deal
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditingDeal(null);
                        setFormData({ title: '', value: '', stage: 'lead', companyId: '', contactIds: [], notes: '' });
                      }}
                      className="px-4 py-2 border border-surface-300 text-surface-700 rounded-lg font-medium hover:bg-surface-50"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Deals;