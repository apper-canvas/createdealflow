import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import dealService from '../services/api/dealService';
import companyService from '../services/api/companyService';
import contactService from '../services/api/contactService';

const DealDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState(null);
  const [company, setCompany] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDealData();
  }, [id]);

  const loadDealData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dealResult, allCompanies, allContacts] = await Promise.all([
        dealService.getById(id),
        companyService.getAll(),
        contactService.getAll()
      ]);
      
      setDeal(dealResult);
      
      if (dealResult.companyId) {
        const companyData = allCompanies.find(c => c.id === dealResult.companyId);
        setCompany(companyData);
      }
      
      if (dealResult.contactIds && dealResult.contactIds.length > 0) {
        const dealContacts = allContacts.filter(contact => 
          dealResult.contactIds.includes(contact.id)
        );
        setContacts(dealContacts);
      }
    } catch (err) {
      setError(err.message || 'Failed to load deal data');
      toast.error('Failed to load deal details');
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

  const handleStageChange = async (newStage) => {
    try {
      await dealService.update(deal.id, { ...deal, stage: newStage });
      setDeal({ ...deal, stage: newStage });
      toast.success(`Deal moved to ${getStageLabel(newStage)}`);
    } catch (error) {
      toast.error('Failed to update deal stage');
    }
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

  if (error || !deal) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-8 text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Deal Not Found</h3>
          <p className="text-surface-600 mb-4">
            {error || 'The deal you are looking for does not exist.'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/deals')}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium"
          >
            Back to Deals
          </motion.button>
        </div>
      </div>
    );
  }

  const dealStages = [
    { value: 'lead', label: 'Lead' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed-won', label: 'Closed Won' },
    { value: 'closed-lost', label: 'Closed Lost' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/deals')}
          className="p-2 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-lg"
        >
          <ApperIcon name="ArrowLeft" size={20} />
        </motion.button>
        <div>
          <h1 className="text-2xl font-heading font-bold text-surface-900">{deal.title}</h1>
          <p className="text-surface-600">Deal Details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deal Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold text-surface-900">Deal Information</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/deals')}
                className="px-3 py-1 text-primary hover:text-primary/80 font-medium text-sm"
              >
                Edit
              </motion.button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <ApperIcon name="DollarSign" size={24} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-surface-900 break-words">{deal.title}</h3>
                  <p className="text-2xl font-bold text-primary">${deal.value.toLocaleString()}</p>
                  <div className="mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStageColor(deal.stage)}`}>
                      {getStageLabel(deal.stage)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Calendar" size={16} className="text-surface-400" />
                  <span className="text-surface-600">
                    Created on {new Date(deal.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                {deal.closedAt && (
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="CheckCircle" size={16} className="text-surface-400" />
                    <span className="text-surface-600">
                      Closed on {new Date(deal.closedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
              
              {deal.notes && (
                <div className="pt-4 border-t border-surface-200">
                  <h4 className="font-medium text-surface-900 mb-2">Notes</h4>
                  <p className="text-surface-600 break-words">{deal.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Stage Management */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
            <h2 className="text-lg font-heading font-semibold text-surface-900 mb-4">Manage Stage</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {dealStages.map((stage) => (
                <motion.button
                  key={stage.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStageChange(stage.value)}
                  disabled={deal.stage === stage.value}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                    deal.stage === stage.value
                      ? `${getStageColor(stage.value)} opacity-50 cursor-not-allowed`
                      : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                  }`}
                >
                  {stage.label}
                  {deal.stage === stage.value && (
                    <div className="mt-1">
                      <ApperIcon name="Check" size={12} className="mx-auto" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
            <h2 className="text-lg font-heading font-semibold text-surface-900 mb-4">Activity Timeline</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Plus" size={14} className="text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900">Deal created</p>
                  <p className="text-xs text-surface-500">
                    {new Date(deal.createdAt).toLocaleDateString()} at {new Date(deal.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              {deal.updatedAt && deal.updatedAt !== deal.createdAt && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Edit" size={14} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-900">Deal updated</p>
                    <p className="text-xs text-surface-500">
                      {new Date(deal.updatedAt).toLocaleDateString()} at {new Date(deal.updatedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              )}
              
              {deal.closedAt && (
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 ${deal.stage === 'closed-won' ? 'bg-success/10' : 'bg-error/10'} rounded-lg flex items-center justify-center`}>
                    <ApperIcon 
                      name={deal.stage === 'closed-won' ? 'CheckCircle' : 'XCircle'} 
                      size={14} 
                      className={deal.stage === 'closed-won' ? 'text-success' : 'text-error'} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-900">
                      Deal {deal.stage === 'closed-won' ? 'won' : 'lost'}
                    </p>
                    <p className="text-xs text-surface-500">
                      {new Date(deal.closedAt).toLocaleDateString()} at {new Date(deal.closedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Section */}
          {company && (
            <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
              <h3 className="font-heading font-semibold text-surface-900 mb-4">Company</h3>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate(`/companies/${company.id}`)}
                className="flex items-center space-x-3 p-3 hover:bg-surface-50 rounded-lg cursor-pointer transition-colors border border-surface-200"
              >
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Building2" size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-surface-900 break-words">{company.name}</p>
                  <p className="text-surface-600 text-sm break-words">{company.industry || 'No industry'}</p>
                </div>
                <ApperIcon name="ExternalLink" size={14} className="text-surface-400" />
              </motion.div>
            </div>
          )}

          {/* Contacts Section */}
          {contacts.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
              <h3 className="font-heading font-semibold text-surface-900 mb-4">
                Contacts ({contacts.length})
              </h3>
              
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
                    <div className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium text-xs">
                        {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-surface-900 text-sm break-words">
                        {contact.firstName} {contact.lastName}
                      </p>
                      <p className="text-surface-600 text-xs break-words">{contact.role || 'No role'}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
            <h3 className="font-heading font-semibold text-surface-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate('/deals')}
                className="flex items-center space-x-3 p-3 text-primary hover:bg-primary/10 rounded-lg transition-colors w-full"
              >
                <ApperIcon name="Edit" size={16} />
                <span className="font-medium">Edit Deal</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate('/pipeline')}
                className="flex items-center space-x-3 p-3 text-primary hover:bg-primary/10 rounded-lg transition-colors w-full"
              >
                <ApperIcon name="BarChart3" size={16} />
                <span className="font-medium">View Pipeline</span>
              </motion.button>
            </div>
          </div>

          {/* Deal Stats */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
            <h3 className="font-heading font-semibold text-surface-900 mb-4">Deal Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-surface-600">Days Open</span>
                <span className="font-semibold text-surface-900">
                  {Math.floor((new Date() - new Date(deal.createdAt)) / (1000 * 60 * 60 * 24))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-600">Stage</span>
                <span className="font-semibold text-surface-900">
                  {getStageLabel(deal.stage)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-600">Value</span>
                <span className="font-semibold text-primary">
                  ${deal.value.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetail;