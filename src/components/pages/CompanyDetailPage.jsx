import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import companyService from '@/services/api/companyService';
import contactService from '@/services/api/contactService';
import dealService from '@/services/api/dealService';

import LoadingSpinner from '@/components/molecules/LoadingSpinner';
import ErrorState from '@/components/molecules/ErrorState';
import DetailHeader from '@/components/organisms/DetailHeader';
import CompanyDetailInfo from '@/components/organisms/CompanyDetailInfo';
import CompanyDetailContacts from '@/components/organisms/CompanyDetailContacts';
import CompanyDetailDeals from '@/components/organisms/CompanyDetailDeals';
import Card from '@/components/molecules/Card';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';

const CompanyDetailPage = () => {
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

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="p-6">
        <ErrorState
          message={error || 'The company you are looking for does not exist.'}
          onRetry={() => navigate('/companies')} // Button acts as "Back to Companies"
          buttonText="Back to Companies"
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <DetailHeader title={company.name} subtitle="Company Details" backPath="/companies" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CompanyDetailInfo company={company} onEdit={() => navigate('/companies')} />
          <CompanyDetailContacts
            contacts={contacts}
            onAddContact={() => navigate('/contacts')}
            onViewContact={(contactId) => navigate(`/contacts/${contactId}`)}
          />
        </div>

        <div className="space-y-6">
          <CompanyDetailDeals
            deals={deals}
            onAddDeal={() => navigate('/deals')}
            onViewDeal={(dealId) => navigate(`/deals/${dealId}`)}
          />
          {deals.length > 0 && (
            <Card>
              <Heading level={3} className="mb-4">Deal Statistics</Heading>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Paragraph className="text-surface-600">Total Value</Paragraph>
                  <Paragraph className="font-semibold text-surface-900">
                    ${deals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}
                  </Paragraph>
                </div>
                <div className="flex justify-between">
                  <Paragraph className="text-surface-600">Won Deals</Paragraph>
                  <Paragraph className="font-semibold text-success">
                    {deals.filter(deal => deal.stage === 'closed-won').length}
                  </Paragraph>
                </div>
                <div className="flex justify-between">
                  <Paragraph className="text-surface-600">Active Deals</Paragraph>
                  <Paragraph className="font-semibold text-primary">
                    {deals.filter(deal => deal.stage !== 'closed-won' && deal.stage !== 'closed-lost').length}
                  </Paragraph>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;