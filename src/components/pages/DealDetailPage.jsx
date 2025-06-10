import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import dealService from '@/services/api/dealService';
import companyService from '@/services/api/companyService';
import contactService from '@/services/api/contactService';

import LoadingSpinner from '@/components/molecules/LoadingSpinner';
import ErrorState from '@/components/molecules/ErrorState';
import DetailHeader from '@/components/organisms/DetailHeader';
import DealDetailInfo from '@/components/organisms/DealDetailInfo';
import DealStageManager from '@/components/organisms/DealStageManager';
import DealActivityTimeline from '@/components/organisms/DealActivityTimeline';
import DealDetailSidebar from '@/components/organisms/DealDetailSidebar';

const DealDetailPage = () => {
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

  const handleStageChange = async (newStage) => {
    try {
      await dealService.update(deal.id, { ...deal, stage: newStage });
      setDeal(prev => ({ ...prev, stage: newStage }));
      toast.success(`Deal moved to ${newStage.charAt(0).toUpperCase() + newStage.slice(1)}`);
    } catch (error) {
      toast.error('Failed to update deal stage');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="p-6">
        <ErrorState
          message={error || 'The deal you are looking for does not exist.'}
          onRetry={() => navigate('/deals')}
          buttonText="Back to Deals"
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <DetailHeader
        title={deal.title}
        subtitle="Deal Details"
        backPath="/deals"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DealDetailInfo deal={deal} onEdit={() => navigate('/deals')} />
          <DealStageManager currentStage={deal.stage} onStageChange={handleStageChange} />
          <DealActivityTimeline deal={deal} />
        </div>

        <DealDetailSidebar
          company={company}
          contacts={contacts}
          deal={deal}
          onCompanyClick={(companyId) => navigate(`/companies/${companyId}`)}
          onContactClick={(contactId) => navigate(`/contacts/${contactId}`)}
          onEditDeal={() => navigate('/deals')}
          onViewPipeline={() => navigate('/pipeline')}
        />
      </div>
    </div>
  );
};

export default DealDetailPage;