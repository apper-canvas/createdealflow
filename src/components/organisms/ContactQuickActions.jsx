import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';
import Card from '@/components/molecules/Card';

const ContactQuickActions = ({ contact, onCreateDeal }) => {
    return (
        <Card>
            <Heading level={3} className="mb-4">Quick Actions</Heading>
            <div className="space-y-3">
                {contact.email && (
                    <Button variant="ghost" as="a" href={`mailto:${contact.email}`} className="flex items-center space-x-3 p-3 w-full">
                        <ApperIcon name="Mail" size={16} />
                        <span className="font-medium">Send Email</span>
                    </Button>
                )}

                {contact.phone && (
                    <Button variant="ghost" as="a" href={`tel:${contact.phone}`} className="flex items-center space-x-3 p-3 w-full">
                        <ApperIcon name="Phone" size={16} />
                        <span className="font-medium">Call Contact</span>
                    </Button>
                )}

                <Button variant="ghost" className="flex items-center space-x-3 p-3 w-full" onClick={onCreateDeal}>
                    <ApperIcon name="Plus" size={16} />
                    <span className="font-medium">Create Deal</span>
                </Button>
            </div>
        </Card>
    );
};

export default ContactQuickActions;