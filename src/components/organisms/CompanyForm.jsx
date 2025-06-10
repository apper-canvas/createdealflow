import React, { useState, useEffect } from 'react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Heading from '@/components/atoms/Heading';

const CompanyForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        industry: '',
        website: '',
        notes: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                industry: initialData.industry || '',
                website: initialData.website || '',
                notes: initialData.notes || ''
            });
        } else {
            setFormData({ name: '', industry: '', website: '', notes: '' });
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

    return (
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <Heading level={2} className="text-xl mb-4">
                {initialData ? 'Edit Company' : 'Add New Company'}
            </Heading>
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                    id="name"
                    label="Company Name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    required
                />
                <FormField
                    id="industry"
                    label="Industry"
                    type="text"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="e.g., Technology, Healthcare"
                />
                <FormField
                    id="website"
                    label="Website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                />
                <FormField
                    id="notes"
                    label="Notes"
                    type="textarea"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Additional notes about the company"
                    rows={3}
                />
                <div className="flex space-x-3 pt-4">
                    <Button type="submit" className="flex-1">
                        {initialData ? 'Update' : 'Create'} Company
                    </Button>
                    <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CompanyForm;