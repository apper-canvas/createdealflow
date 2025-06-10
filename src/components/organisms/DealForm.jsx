import React, { useState, useEffect } from 'react';
import FormField from '@/components/molecules/FormField';
import Label from '@/components/atoms/Label';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';

const dealStages = [
    { value: 'lead', label: 'Lead' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed-won', label: 'Closed Won' },
    { value: 'closed-lost', label: 'Closed Lost' }
];

const DealForm = ({ initialData, onSubmit, onCancel, companies, contacts }) => {
    const [formData, setFormData] = useState({
        title: '',
        value: '',
        stage: 'lead',
        companyId: '',
        contactIds: [],
        notes: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                value: initialData.value?.toString() || '',
                stage: initialData.stage || 'lead',
                companyId: initialData.companyId || '',
                contactIds: initialData.contactIds || [],
                notes: initialData.notes || ''
            });
        } else {
            setFormData({ title: '', value: '', stage: 'lead', companyId: '', contactIds: [], notes: '' });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleContactChange = (contactId, checked) => {
        setFormData(prev => {
            const newContactIds = checked
                ? [...prev.contactIds, contactId]
                : prev.contactIds.filter(id => id !== contactId);
            return { ...prev, contactIds: newContactIds };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            value: parseFloat(formData.value) || 0
        });
    };

    const companyOptions = [
        { value: '', label: 'Select a company' },
        ...companies.map(company => ({ value: company.id, label: company.name }))
    ];

    const filteredContacts = formData.companyId
        ? contacts.filter(contact => contact.companyId === formData.companyId)
        : contacts;

    return (
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <Heading level={2} className="text-xl mb-4">
                {initialData ? 'Edit Deal' : 'Add New Deal'}
            </Heading>
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                    id="title"
                    label="Deal Title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter deal title"
                    required
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        id="value"
                        label="Value"
                        type="number"
                        value={formData.value}
                        onChange={handleChange}
                        placeholder="0.00"
                        required
                        min="0"
                        step="0.01"
                    />
                    <FormField
                        id="stage"
                        label="Stage"
                        type="select"
                        value={formData.stage}
                        onChange={handleChange}
                        options={dealStages}
                        required
                    />
                </div>
                <FormField
                    id="companyId"
                    label="Company"
                    type="select"
                    value={formData.companyId}
                    onChange={handleChange}
                    options={companyOptions}
                />
                <div>
                    <Label htmlFor="contactIds" className="mb-2">Contacts</Label>
                    <div className="max-h-32 overflow-y-auto border border-surface-300 rounded-lg p-2 space-y-2">
                        {filteredContacts.length === 0 ? (
                            <p className="text-sm text-surface-500 text-center py-2">
                                {formData.companyId ? 'No contacts for selected company' : 'Select a company to see contacts'}
                            </p>
                        ) : (
                            filteredContacts.map(contact => (
                                <label key={contact.id} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.contactIds.includes(contact.id)}
                                        onChange={(e) => handleContactChange(contact.id, e.target.checked)}
                                        className="rounded border-surface-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm text-surface-700">
                                        {contact.firstName} {contact.lastName}
                                    </span>
                                </label>
                            ))
                        )}
                    </div>
                </div>
                <FormField
                    id="notes"
                    label="Notes"
                    type="textarea"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Additional notes about the deal"
                    rows={3}
                />
                <div className="flex space-x-3 pt-4">
                    <Button type="submit" className="flex-1">
                        {initialData ? 'Update' : 'Create'} Deal
                    </Button>
                    <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default DealForm;