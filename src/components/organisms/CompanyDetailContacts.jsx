import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Card from '@/components/molecules/Card';
import DetailSectionHeader from '@/components/molecules/DetailSectionHeader';
import ContactAvatar from '@/components/molecules/ContactAvatar';

const CompanyDetailContacts = ({ contacts, onAddContact, onViewContact }) => {
    return (
        <Card>
            <DetailSectionHeader title={`Contacts (${contacts.length})`} onAdd={onAddContact} actionType="add" buttonText="Add Contact" />
            {contacts.length === 0 ? (
                <div className="text-center py-8">
                    <ApperIcon name="Users" size={32} className="text-surface-300 mx-auto mb-3" />
                    <Paragraph className="text-surface-600">No contacts yet</Paragraph>
                    <Paragraph className="text-sm text-surface-500">Add contacts to this company</Paragraph>
                </div>
            ) : (
                <div className="space-y-3">
                    {contacts.map((contact, index) => (
                        <motion.div
                            key={contact.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => onViewContact(contact.id)}
                            className="flex items-center space-x-3 p-3 hover:bg-surface-50 rounded-lg cursor-pointer transition-colors"
                        >
                            <ContactAvatar firstName={contact.firstName} lastName={contact.lastName} />
                            <div className="flex-1 min-w-0">
                                <Paragraph className="font-medium text-surface-900 break-words">
                                    {contact.firstName} {contact.lastName}
                                </Paragraph>
                                <Paragraph className="text-sm break-words">{contact.role || 'No role specified'}</Paragraph>
                                {contact.email && (
                                    <Paragraph className="text-sm break-all text-surface-500">{contact.email}</Paragraph>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default CompanyDetailContacts;