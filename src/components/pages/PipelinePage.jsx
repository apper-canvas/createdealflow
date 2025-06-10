import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import dealService from '@/services/api/dealService';
import companyService from '@/services/api/companyService';

import LoadingSpinner from '@/components/molecules/LoadingSpinner';
import ErrorState from '@/components/molecules/ErrorState';
import PageHeader from '@/components/organisms/PageHeader';
import PipelineColumn from '@/components/organisms/PipelineColumn';
import Card from '@/components/molecules/Card';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';

const PipelinePage = () => {
  const [deals, setDeals] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dealStagesConfig = [
    { value: 'lead', label: 'Lead', color: 'bg-info' },
    { value: 'negotiation', label: 'Negotiation', color: 'bg-warning' },
    { value: 'closed-won', label: 'Closed Won', color: 'bg-success' },
    { value: 'closed-lost', label: 'Closed Lost', color: 'bg-error' }
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
      toast.success(`Deal moved to ${dealStagesConfig.find(s => s.value === newStage)?.label}`);
      await loadData();
    } catch (error) {
      toast.error('Failed to update deal stage');
    }
  };

  // Group deals by stage and calculate statistics
  const groupedDeals = dealStagesConfig.map(stage => {
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
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadData} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Pipeline"
        description="Track your deals through the sales process"
      />

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
              <Heading level={3}>{stage.label}</Heading>
              <div className={`w-3 h-3 ${stage.color} rounded-full`}></div>
            </div>
            <Paragraph className="text-2xl font-bold text-surface-900">{stage.count}</Paragraph>
            <Paragraph className="text-sm text-surface-600">${stage.value.toLocaleString()} total</Paragraph>
          </motion.div>
        ))}
      </div>

      {/* Pipeline Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {groupedDeals.map((stage, stageIndex) => (
          <PipelineColumn
            key={stage.value}
            stage={stage}
            deals={stage.deals}
            getCompanyName={getCompanyName}
            handleStageChange={handleStageChange}
            stageIndex={stageIndex}
          />
        ))}
      </div>

      {/* Pipeline Summary */}
      <Card>
        <Heading level={2} className="text-lg mb-4">Pipeline Summary</Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Paragraph className="text-3xl font-bold text-primary">
              {deals.filter(d => d.stage !== 'closed-won' && d.stage !== 'closed-lost').length}
            </Paragraph>
            <Paragraph>Active Deals</Paragraph>
          </div>
          <div className="text-center">
            <Paragraph className="text-3xl font-bold text-success">
              ${deals
                .filter(d => d.stage !== 'closed-won' && d.stage !== 'closed-lost')
                .reduce((sum, deal) => sum + deal.value, 0)
                .toLocaleString()}
            </Paragraph>
            <Paragraph>Pipeline Value</Paragraph>
          </div>
          <div className="text-center">
            <Paragraph className="text-3xl font-bold text-warning">
              ${deals
                .filter(d => d.stage === 'closed-won')
                .reduce((sum, deal) => sum + deal.value, 0)
                .toLocaleString()}
            </Paragraph>
            <Paragraph>Closed Revenue</Paragraph>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PipelinePage;