import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import contactService from '@/services/api/contactService';
import companyService from '@/services/api/companyService';
import dealService from '@/services/api/dealService';

import LoadingSpinner from '@/components/molecules/LoadingSpinner';
import ErrorState from '@/components/molecules/ErrorState';
import DetailHeader from '@/components/organisms/DetailHeader';
import ContactDetailInfo from '@/components/organisms/ContactDetailInfo';
import ContactDetailCompany from '@/components/organisms/ContactDetailCompany';
import ContactDetailDeals from '@/components/organisms/ContactDetailDeals';
import ContactQuickActions from '@/components/organisms/ContactQuickActions';
import Card from '@/components/molecules/Card';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';

const ContactDetailPage = () => {
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

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="p-6">
        <ErrorState
          message={error || 'The contact you are looking for does not exist.'}
          onRetry={() => navigate('/contacts')}
          buttonText="Back to Contacts"
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <DetailHeader
        title={`${contact.firstName} ${contact.lastName}`}
        subtitle="Contact Details"
        backPath="/contacts"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ContactDetailInfo contact={contact} onEdit={() => navigate('/contacts')} />
          <ContactDetailCompany company={company} onCompanyClick={(companyId) => navigate(`/companies/${companyId}`)} />
          <ContactDetailDeals
            deals={deals}
            onAddDeal={() => navigate('/deals')}
            onViewDeal={(dealId) => navigate(`/deals/${dealId}`)}
          />
        </div>

        <div className="space-y-6">
          <ContactQuickActions contact={contact} onCreateDeal={() => navigate('/deals')} />
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

export default ContactDetailPage;