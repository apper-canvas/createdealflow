import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import companyService from '@/services/api/companyService';

import PageHeader from '@/components/organisms/PageHeader';
import SearchInput from '@/components/molecules/SearchInput';
import CompanyListItem from '@/components/molecules/CompanyListItem';
import EmptyState from '@/components/molecules/EmptyState';
import LoadingSpinner from '@/components/molecules/LoadingSpinner';
import ErrorState from '@/components/molecules/ErrorState';
import Modal from '@/components/organisms/Modal';
import CompanyForm from '@/components/organisms/CompanyForm';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await companyService.getAll();
      setCompanies(result);
    } catch (err) {
      setError(err.message || 'Failed to load companies');
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingCompany) {
        await companyService.update(editingCompany.id, formData);
        toast.success('Company updated successfully');
      } else {
        await companyService.create(formData);
        toast.success('Company created successfully');
      }
      await loadCompanies();
      closeModal();
    } catch (error) {
      toast.error('Failed to save company');
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setShowModal(true);
  };

  const handleDelete = async (company) => {
    if (window.confirm(`Are you sure you want to delete ${company.name}?`)) {
      try {
        await companyService.delete(company.id);
        toast.success('Company deleted successfully');
        await loadCompanies();
      } catch (error) {
        toast.error('Failed to delete company');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCompany(null);
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase())
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
        <ErrorState message={error} onRetry={loadCompanies} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Companies"
        description="Manage your business relationships"
        primaryButtonText="Add Company"
        primaryButtonIcon="Plus"
        onPrimaryButtonClick={() => setShowModal(true)}
      />

      <SearchInput
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        placeholder="Search companies..."
      />

      {filteredCompanies.length === 0 ? (
        <EmptyState
          icon="Building2"
          title={searchTerm ? 'No companies found' : 'No companies yet'}
          description={searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first company'}
          buttonText="Add First Company"
          onButtonClick={() => setShowModal(true)}
          showButton={!searchTerm}
        />
      ) : (
        <div className="grid gap-4">
          {filteredCompanies.map((company, index) => (
            <CompanyListItem
              key={company.id}
              company={company}
              index={index}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={(id) => navigate(`/companies/${id}`)}
            />
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={closeModal}>
        <CompanyForm
          initialData={editingCompany}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default CompaniesPage;