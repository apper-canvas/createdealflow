import React, { useState, useEffect } from 'react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';

const ContactForm = ({ initialData, onSubmit, onCancel, companies }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        companyId: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                firstName: initialData.firstName || '',
                lastName: initialData.lastName || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                role: initialData.role || '',
                companyId: initialData.companyId || ''
            });
        } else {
            setFormData({ firstName: '', lastName: '', email: '', phone: '', role: '', companyId: '' });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const companyOptions = [
        { value: '', label: 'Select a company' },
        ...companies.map(company => ({ value: company.id, label: company.name }))
    ];

    return (
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <Heading level={2} className="text-xl mb-4">
                {initialData ? 'Edit Contact' : 'Add New Contact'}
            </Heading>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        id="firstName"
                        label="First Name"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        required
                    />
                    <FormField
                        id="lastName"
                        label="Last Name"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Smith"
                        required
                    />
                </div>
                <FormField
                    id="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                />
                <FormField
                    id="phone"
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                />
                <FormField
                    id="role"
                    label="Role"
                    type="text"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g., CEO, Sales Manager"
                />
                <FormField
                    id="companyId"
                    label="Company"
                    type="select"
                    value={formData.companyId}
                    onChange={handleChange}
                    options={companyOptions}
                />
                <div className="flex space-x-3 pt-4">
                    <Button type="submit" className="flex-1">
                        {initialData ? 'Update' : 'Create'} Contact
                    </Button>
                    <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;