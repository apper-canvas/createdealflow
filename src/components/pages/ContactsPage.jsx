import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import contactService from '@/services/api/contactService';
import companyService from '@/services/api/companyService';

import PageHeader from '@/components/organisms/PageHeader';
import SearchInput from '@/components/molecules/SearchInput';
import ContactListItem from '@/components/molecules/ContactListItem';
import EmptyState from '@/components/molecules/EmptyState';
import LoadingSpinner from '@/components/molecules/LoadingSpinner';
import ErrorState from '@/components/molecules/ErrorState';
import Modal from '@/components/organisms/Modal';
import ContactForm from '@/components/organisms/ContactForm';

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [contactsResult, companiesResult] = await Promise.all([
        contactService.getAll(),
        companyService.getAll()
      ]);
      setContacts(contactsResult);
      setCompanies(companiesResult);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'No Company';
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingContact) {
        await contactService.update(editingContact.id, formData);
        toast.success('Contact updated successfully');
      } else {
        await contactService.create(formData);
        toast.success('Contact created successfully');
      }
      await loadData();
      closeModal();
    } catch (error) {
      toast.error('Failed to save contact');
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setShowModal(true);
  };

  const handleDelete = async (contact) => {
    if (window.confirm(`Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`)) {
      try {
        await contactService.delete(contact.id);
        toast.success('Contact deleted successfully');
        await loadData();
      } catch (error) {
        toast.error('Failed to delete contact');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingContact(null);
  };

  const filteredContacts = contacts.filter(contact =>
    `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCompanyName(contact.companyId).toLowerCase().includes(searchTerm.toLowerCase())
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
        title="Contacts"
        description="Manage your business contacts"
        primaryButtonText="Add Contact"
        primaryButtonIcon="UserPlus"
        onPrimaryButtonClick={() => setShowModal(true)}
      />

      <SearchInput
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        placeholder="Search contacts..."
      />

      {filteredContacts.length === 0 ? (
        <EmptyState
          icon="Users"
          title={searchTerm ? 'No contacts found' : 'No contacts yet'}
          description={searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first contact'}
          buttonText="Add First Contact"
          onButtonClick={() => setShowModal(true)}
          showButton={!searchTerm}
        />
      ) : (
        <div className="grid gap-4">
          {filteredContacts.map((contact, index) => (
            <ContactListItem
              key={contact.id}
              contact={contact}
              companyName={getCompanyName(contact.companyId)}
              index={index}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={(id) => navigate(`/contacts/${id}`)}
            />
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={closeModal}>
        <ContactForm
          initialData={editingContact}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          companies={companies}
        />
      </Modal>
    </div>
  );
};

export default ContactsPage;