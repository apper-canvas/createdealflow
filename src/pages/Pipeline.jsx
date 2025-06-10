import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import dealService from '../services/api/dealService';
import companyService from '../services/api/companyService';

const Pipeline = () => {
  const [deals, setDeals] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dealStages = [
    { value: 'lead', label: 'Lead', color: 'bg-info', count: 0, value: 0 },
    { value: 'negotiation', label: 'Negotiation', color: 'bg-warning', count: 0, value: 0 },
    { value: 'closed-won', label: 'Closed Won', color: 'bg-success', count: 0, value: 0 },
    { value: 'closed-lost', label: 'Closed Lost', color: 'bg-error', count: 0, value: 0 }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dealsResult, companiesResult] = await Promise.all([
        dealService.getAll(),
        companyService.getAll()
      ]);
      setDeals(dealsResult);
      setCompanies(companiesResult);
    } catch (err) {
      setError(err.message || 'Failed to load pipeline data');
      toast.error('Failed to load pipeline');
    } finally {
      setLoading(false);
    }
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'No Company';
  };

  const handleStageChange = async (dealId, newStage) => {
    try {
      const deal = deals.find(d => d.id === dealId);
      if (!deal) return;

      await dealService.update(dealId, { ...deal, stage: newStage });
      toast.success(`Deal moved to ${dealStages.find(s => s.value === newStage)?.label}`);
      await loadData();
    } catch (error) {
      toast.error('Failed to update deal stage');
    }
  };

  // Group deals by stage and calculate statistics
  const groupedDeals = dealStages.map(stage => {
    const stageDeals = deals.filter(deal => deal.stage === stage.value);
    return {
      ...stage,
      deals: stageDeals,
      count: stageDeals.length,
      value: stageDeals.reduce((sum, deal) => sum + deal.value, 0)
    };
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-20 bg-surface-200 rounded"></div>
                  <div className="h-20 bg-surface-200 rounded"></div>
                </div>
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
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Error Loading Pipeline</h3>
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
      <div>
        <h1 className="text-2xl font-heading font-bold text-surface-900">Pipeline</h1>
        <p className="text-surface-600">Track your deals through the sales process</p>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {groupedDeals.map((stage, index) => (
          <motion.div
            key={stage.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-surface-200"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-surface-900">{stage.label}</h3>
              <div className={`w-3 h-3 ${stage.color} rounded-full`}></div>
            </div>
            <p className="text-2xl font-bold text-surface-900">{stage.count}</p>
            <p className="text-sm text-surface-600">${stage.value.toLocaleString()} total</p>
          </motion.div>
        ))}
      </div>

      {/* Pipeline Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {groupedDeals.map((stage, stageIndex) => (
          <div key={stage.value} className="space-y-4">
            <div className={`${stage.color} text-white p-4 rounded-lg`}>
              <h2 className="font-heading font-semibold">{stage.label}</h2>
              <p className="text-sm opacity-90">
                {stage.count} deals • ${stage.value.toLocaleString()}
              </p>
            </div>

            <div className="space-y-3 min-h-[200px]">
              {stage.deals.length === 0 ? (
                <div className="bg-surface-100 border-2 border-dashed border-surface-300 rounded-lg p-6 text-center">
                  <ApperIcon name="Plus" size={24} className="text-surface-400 mx-auto mb-2" />
                  <p className="text-surface-500 text-sm">No deals in this stage</p>
                </div>
              ) : (
                stage.deals.map((deal, dealIndex) => (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: stageIndex * 0.1 + dealIndex * 0.05 }}
                    className="bg-white rounded-lg p-4 shadow-sm border border-surface-200 hover:shadow-md transition-shadow cursor-move"
                  >
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-surface-900 break-words">{deal.title}</h3>
                        <p className="text-lg font-bold text-primary">
                          ${deal.value.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Building2" size={12} className="text-surface-400" />
                          <span className="text-xs text-surface-600 break-words">
                            {getCompanyName(deal.companyId)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Calendar" size={12} className="text-surface-400" />
                          <span className="text-xs text-surface-600">
                            {new Date(deal.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {deal.notes && (
                        <p className="text-xs text-surface-600 break-words line-clamp-2">
                          {deal.notes}
                        </p>
                      )}

                      {/* Stage Actions */}
                      <div className="flex space-x-1 pt-2 border-t border-surface-100">
                        {dealStages
                          .filter(s => s.value !== deal.stage)
                          .map(targetStage => (
                            <motion.button
                              key={targetStage.value}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleStageChange(deal.id, targetStage.value)}
                              className="flex-1 px-2 py-1 text-xs text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded"
                              title={`Move to ${targetStage.label}`}
                            >
                              {targetStage.value === 'lead' && <ApperIcon name="ArrowLeft" size={12} />}
                              {targetStage.value === 'negotiation' && <ApperIcon name="ArrowRight" size={12} />}
                              {targetStage.value === 'closed-won' && <ApperIcon name="CheckCircle" size={12} />}
                              {targetStage.value === 'closed-lost' && <ApperIcon name="XCircle" size={12} />}
                            </motion.button>
                          ))}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Summary */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
        <h2 className="text-lg font-heading font-semibold text-surface-900 mb-4">Pipeline Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">
              {deals.filter(d => d.stage !== 'closed-won' && d.stage !== 'closed-lost').length}
            </p>
            <p className="text-surface-600">Active Deals</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-success">
              ${deals
                .filter(d => d.stage !== 'closed-won' && d.stage !== 'closed-lost')
                .reduce((sum, deal) => sum + deal.value, 0)
                .toLocaleString()}
            </p>
            <p className="text-surface-600">Pipeline Value</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-warning">
              ${deals
                .filter(d => d.stage === 'closed-won')
                .reduce((sum, deal) => sum + deal.value, 0)
                .toLocaleString()}
            </p>
            <p className="text-surface-600">Closed Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pipeline;