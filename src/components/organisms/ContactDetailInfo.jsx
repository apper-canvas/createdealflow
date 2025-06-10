import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Card from '@/components/molecules/Card';
import DetailSectionHeader from '@/components/molecules/DetailSectionHeader';
import ContactAvatar from '@/components/molecules/ContactAvatar';

const ContactDetailInfo = ({ contact, onEdit }) => {
    return (
        <Card>
            <DetailSectionHeader title="Contact Information" onEdit={onEdit} />
            <div className="space-y-4">
                <div className="flex items-start space-x-3">
                    <ContactAvatar firstName={contact.firstName} lastName={contact.lastName} size={20} />
                    <div className="flex-1 min-w-0">
                        <Heading level={3} className="text-xl break-words">
                            {contact.firstName} {contact.lastName}
                        </Heading>
                        <Paragraph className="break-words">{contact.role || 'No role specified'}</Paragraph>
                    </div>
                </div>

                <div className="space-y-3">
                    {contact.email && (
                        <div className="flex items-center space-x-3">
                            <ApperIcon name="Mail" size={16} className="text-surface-400" />
                            <a
                                href={`mailto:${contact.email}`}
                                className="text-primary hover:text-primary/80 break-all"
                            >
                                {contact.email}
                            </a>
                        </div>
                    )}

                    {contact.phone && (
                        <div className="flex items-center space-x-3">
                            <ApperIcon name="Phone" size={16} className="text-surface-400" />
                            <a
                                href={`tel:${contact.phone}`}
                                className="text-primary hover:text-primary/80 break-words"
                            >
                                {contact.phone}
                            </a>
                        </div>
                    )}

                    <div className="flex items-center space-x-3">
                        <ApperIcon name="Calendar" size={16} className="text-surface-400" />
                        <Paragraph>Created on {new Date(contact.createdAt).toLocaleDateString()}</Paragraph>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ContactDetailInfo;