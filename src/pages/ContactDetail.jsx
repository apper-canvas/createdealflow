import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import contactService from '../services/api/contactService';
import companyService from '../services/api/companyService';
import dealService from '../services/api/dealService';

const ContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [company, setCompany] = useState(null);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadContactData();
  }, [id]);

  const loadContactData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [contactResult, allDeals, allCompanies] = await Promise.all([
        contactService.getById(id),
        dealService.getAll(),
        companyService.getAll()
      ]);
      
      setContact(contactResult);
      setDeals(allDeals.filter(deal => deal.contactIds?.includes(id)));
      
      if (contactResult.companyId) {
        const companyData = allCompanies.find(c => c.id === contactResult.companyId);
        setCompany(companyData);
      }
    } catch (err) {
      setError(err.message || 'Failed to load contact data');
      toast.error('Failed to load contact details');
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

  if (error || !contact) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-8 text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Contact Not Found</h3>
          <p className="text-surface-600 mb-4">
            {error || 'The contact you are looking for does not exist.'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/contacts')}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium"
          >
            Back to Contacts
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
          onClick={() => navigate('/contacts')}
          className="p-2 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-lg"
        >
          <ApperIcon name="ArrowLeft" size={20} />
        </motion.button>
        <div>
          <h1 className="text-2xl font-heading font-bold text-surface-900">
            {contact.firstName} {contact.lastName}
          </h1>
          <p className="text-surface-600">Contact Details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold text-surface-900">Contact Information</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/contacts')}
                className="px-3 py-1 text-primary hover:text-primary/80 font-medium text-sm"
              >
                Edit
              </motion.button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-xl">
                    {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-surface-900 break-words">
                    {contact.firstName} {contact.lastName}
                  </h3>
                  <p className="text-surface-600 break-words">{contact.role || 'No role specified'}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {contact.email && (
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Mail" size={16} className="text-surface-400" />
                    <a 
                      href={`mailto:${contact.email}`}
                      className="text-primary hover:text-primary/80 break-all"
                    >
                      {contact.email}
                    </a>
                  </div>
                )}
                
                {contact.phone && (
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Phone" size={16} className="text-surface-400" />
                    <a 
                      href={`tel:${contact.phone}`}
                      className="text-primary hover:text-primary/80 break-words"
                    >
                      {contact.phone}
                    </a>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Calendar" size={16} className="text-surface-400" />
                  <span className="text-surface-600">
                    Created on {new Date(contact.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Section */}
          {company && (
            <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
              <h2 className="text-lg font-heading font-semibold text-surface-900 mb-4">Company</h2>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate(`/companies/${company.id}`)}
                className="flex items-center space-x-3 p-4 hover:bg-surface-50 rounded-lg cursor-pointer transition-colors border border-surface-200"
              >
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Building2" size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-surface-900 break-words">{company.name}</h3>
                  <p className="text-surface-600 break-words">{company.industry || 'No industry specified'}</p>
                  {company.website && (
                    <p className="text-surface-500 text-sm break-all">{company.website}</p>
                  )}
                </div>
                <ApperIcon name="ExternalLink" size={16} className="text-surface-400" />
              </motion.div>
            </div>
          )}

          {/* Deals Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-semibold text-surface-900">
                Associated Deals ({deals.length})
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
                <p className="text-surface-500 text-sm">This contact is not associated with any deals</p>
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
                    className="p-4 hover:bg-surface-50 rounded-lg cursor-pointer transition-colors border border-surface-200"
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
                      <div className="flex items-center space-x-2 text-xs text-surface-500">
                        <ApperIcon name="Calendar" size={12} />
                        <span>Created {new Date(deal.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
            <h3 className="font-heading font-semibold text-surface-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {contact.email && (
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  href={`mailto:${contact.email}`}
                  className="flex items-center space-x-3 p-3 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <ApperIcon name="Mail" size={16} />
                  <span className="font-medium">Send Email</span>
                </motion.a>
              )}
              
              {contact.phone && (
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  href={`tel:${contact.phone}`}
                  className="flex items-center space-x-3 p-3 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <ApperIcon name="Phone" size={16} />
                  <span className="font-medium">Call Contact</span>
                </motion.a>
              )}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate('/deals')}
                className="flex items-center space-x-3 p-3 text-primary hover:bg-primary/10 rounded-lg transition-colors w-full"
              >
                <ApperIcon name="Plus" size={16} />
                <span className="font-medium">Create Deal</span>
              </motion.button>
            </div>
          </div>

          {/* Deal Statistics */}
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

export default ContactDetail;