import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import dealService from '@/services/api/dealService';
import companyService from '@/services/api/companyService';
import contactService from '@/services/api/contactService';

import PageHeader from '@/components/organisms/PageHeader';
import SearchInput from '@/components/molecules/SearchInput';
import DealListItem from '@/components/molecules/DealListItem';
import EmptyState from '@/components/molecules/EmptyState';
import LoadingSpinner from '@/components/molecules/LoadingSpinner';
import ErrorState from '@/components/molecules/ErrorState';
import Modal from '@/components/organisms/Modal';
import DealForm from '@/components/organisms/DealForm';
import DealStageTag from '@/components/molecules/DealStageTag'; // for getStageInfo

const DealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const navigate = useNavigate();

  const getStageInfo = (stage) => {
    // This logic is duplicated, but kept local to avoid creating a shared utility until needed.
    // In a larger app, this might be a context or a shared helper function.
    const dealStages = [
        { value: 'lead', label: 'Lead', color: 'bg-info text-white' },
        { value: 'negotiation', label: 'Negotiation', color: 'bg-warning text-white' },
        { value: 'closed-won', label: 'Closed Won', color: 'bg-success text-white' },
        { value: 'closed-lost', label: 'Closed Lost', color: 'bg-error text-white' }
    ];
    return dealStages.find(s => s.value === stage) || dealStages[0];
  };

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

  const handleFormSubmit = async (formData) => {
    try {
      if (editingDeal) {
        await dealService.update(editingDeal.id, formData);
        toast.success('Deal updated successfully');
      } else {
        await dealService.create(formData);
        toast.success('Deal created successfully');
      }
      await loadData();
      closeModal();
    } catch (error) {
      toast.error('Failed to save deal');
    }
  };

  const handleEdit = (deal) => {
    setEditingDeal(deal);
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

  const closeModal = () => {
    setShowModal(false);
    setEditingDeal(null);
  };

  const filteredDeals = deals.filter(deal =>
    deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCompanyName(deal.companyId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getContactNames(deal.contactIds || []).toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        title="Deals"
        description="Track your sales opportunities"
        primaryButtonText="Add Deal"
        primaryButtonIcon="Plus"
        onPrimaryButtonClick={() => setShowModal(true)}
      />

      <SearchInput
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        placeholder="Search deals..."
      />

      {filteredDeals.length === 0 ? (
        <EmptyState
          icon="DollarSign"
          title={searchTerm ? 'No deals found' : 'No deals yet'}
          description={searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first deal'}
          buttonText="Create First Deal"
          onButtonClick={() => setShowModal(true)}
          showButton={!searchTerm}
        />
      ) : (
        <div className="grid gap-4">
          {filteredDeals.map((deal, index) => (
            <DealListItem
              key={deal.id}
              deal={deal}
              companyName={getCompanyName(deal.companyId)}
              contactNames={getContactNames(deal.contactIds || [])}
              stageInfo={getStageInfo(deal.stage)}
              index={index}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={(id) => navigate(`/deals/${id}`)}
            />
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={closeModal}>
        <DealForm
          initialData={editingDeal}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          companies={companies}
          contacts={contacts}
        />
      </Modal>
    </div>
  );
};

export default DealsPage;