import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import companyService from '../services/api/companyService';
import contactService from '../services/api/contactService';
import dealService from '../services/api/dealService';

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCompanyData();
  }, [id]);

  const loadCompanyData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [companyResult, allContacts, allDeals] = await Promise.all([
        companyService.getById(id),
        contactService.getAll(),
        dealService.getAll()
      ]);
      
      setCompany(companyResult);
      setContacts(allContacts.filter(contact => contact.companyId === id));
      setDeals(allDeals.filter(deal => deal.companyId === id));
    } catch (err) {
      setError(err.message || 'Failed to load company data');
      toast.error('Failed to load company details');
    } finally {
      setLoading(false);
    }
  };

  const getStageColor = (stage) => {
    const colors = {
      'lead': 'bg-info text-white',
      'negotiation': 'bg-warning text-white',
      'closed-won': 'bg-success text-white',
      'closed-lost': 'bg-error text-white'
    };
    return colors[stage] || 'bg-surface-200 text-surface-700';
  };

  const getStageLabel = (stage) => {
    const labels = {
      'lead': 'Lead',
      'negotiation': 'Negotiation',
      'closed-won': 'Closed Won',
      'closed-lost': 'Closed Lost'
    };
    return labels[stage] || stage;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface-200 rounded w-1/3"></div>
          <div className="bg-white rounded-lg p-6 space-y-4">
            <div className="h-6 bg-surface-200 rounded w-1/2"></div>
            <div className="h-4 bg-surface-200 rounded w-3/4"></div>
            <div className="h-4 bg-surface-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-8 text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Company Not Found</h3>
          <p className="text-surface-600 mb-4">
            {error || 'The company you are looking for does not exist.'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/companies')}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium"
          >
            Back to Companies
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/companies')}
          className="p-2 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-lg"
        >
          <ApperIcon name="ArrowLeft" size={20} />
        </motion.button>
        <div>
          <h1 className="text-2xl font-heading font-bold text-surface-900">{company.name}</h1>
          <p className="text-surface-600">Company Details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold text-surface-900">Company Information</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/companies')}
                className="px-3 py-1 text-primary hover:text-primary/80 font-medium text-sm"
              >
                Edit
              </motion.button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Building2" size={24} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-surface-900 break-words">{company.name}</h3>
                  <p className="text-surface-600 break-words">{company.industry || 'No industry specified'}</p>
                </div>
              </div>
              
              {company.website && (
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Globe" size={16} className="text-surface-400" />
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 break-all"
                  >
                    {company.website}
                  </a>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <ApperIcon name="Calendar" size={16} className="text-surface-400" />
                <span className="text-surface-600">
                  Created on {new Date(company.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              {company.notes && (
                <div className="pt-4 border-t border-surface-200">
                  <h4 className="font-medium text-surface-900 mb-2">Notes</h4>
                  <p className="text-surface-600 break-words">{company.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Contacts Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold text-surface-900">
                Contacts ({contacts.length})
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/contacts')}
                className="px-3 py-1 text-primary hover:text-primary/80 font-medium text-sm"
              >
                Add Contact
              </motion.button>
            </div>
            
            {contacts.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Users" size={32} className="text-surface-300 mx-auto mb-3" />
                <p className="text-surface-600">No contacts yet</p>
                <p className="text-surface-500 text-sm">Add contacts to this company</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.map((contact, index) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => navigate(`/contacts/${contact.id}`)}
                    className="flex items-center space-x-3 p-3 hover:bg-surface-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-surface-900 break-words">
                        {contact.firstName} {contact.lastName}
                      </p>
                      <p className="text-surface-600 text-sm break-words">{contact.role || 'No role specified'}</p>
                      {contact.email && (
                        <p className="text-surface-500 text-sm break-all">{contact.email}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Deals Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold text-surface-900">
                Deals ({deals.length})
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/deals')}
                className="px-3 py-1 text-primary hover:text-primary/80 font-medium text-sm"
              >
                Add Deal
              </motion.button>
            </div>
            
            {deals.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="DollarSign" size={32} className="text-surface-300 mx-auto mb-3" />
                <p className="text-surface-600">No deals yet</p>
                <p className="text-surface-500 text-sm">Create deals for this company</p>
              </div>
            ) : (
              <div className="space-y-3">
                {deals.map((deal, index) => (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => navigate(`/deals/${deal.id}`)}
                    className="p-3 hover:bg-surface-50 rounded-lg cursor-pointer transition-colors border border-surface-200"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-surface-900 break-words">{deal.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(deal.stage)}`}>
                          {getStageLabel(deal.stage)}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-primary">
                        ${deal.value.toLocaleString()}
                      </p>
                      {deal.notes && (
                        <p className="text-surface-600 text-sm break-words line-clamp-2">
                          {deal.notes}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          {deals.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
              <h3 className="font-heading font-semibold text-surface-900 mb-4">Deal Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-surface-600">Total Value</span>
                  <span className="font-semibold text-surface-900">
                    ${deals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Won Deals</span>
                  <span className="font-semibold text-success">
                    {deals.filter(deal => deal.stage === 'closed-won').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Active Deals</span>
                  <span className="font-semibold text-primary">
                    {deals.filter(deal => deal.stage !== 'closed-won' && deal.stage !== 'closed-lost').length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;