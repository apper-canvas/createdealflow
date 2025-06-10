import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Button from '@/components/atoms/Button';
import Card from '@/components/molecules/Card';
import ContactAvatar from '@/components/molecules/ContactAvatar';

const ContactListItem = ({ contact, companyName, index, onEdit, onDelete, onViewDetails }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Card className="hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                            <ContactAvatar firstName={contact.firstName} lastName={contact.lastName} />
                            <div className="flex-1 min-w-0">
                                <Heading
                                    level={2}
                                    className="cursor-pointer hover:text-primary break-words"
                                    onClick={() => onViewDetails(contact.id)}
                                >
                                    {contact.firstName} {contact.lastName}
                                </Heading>
                                <Paragraph className="break-words">{contact.role}</Paragraph>
                                <Paragraph className="text-sm break-words text-surface-500">{companyName}</Paragraph>
                            </div>
                        </div>
                        <div className="mt-3 space-y-1">
                            {contact.email && (
                                <div className="flex items-center space-x-2">
                                    <ApperIcon name="Mail" size={14} className="text-surface-400" />
                                    <a
                                        href={`mailto:${contact.email}`}
                                        className="text-primary hover:text-primary/80 text-sm break-all"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {contact.email}
                                    </a>
                                </div>
                            )}
                            {contact.phone && (
                                <div className="flex items-center space-x-2">
                                    <ApperIcon name="Phone" size={14} className="text-surface-400" />
                                    <a
                                        href={`tel:${contact.phone}`}
                                        className="text-primary hover:text-primary/80 text-sm break-words"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {contact.phone}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                        <Button variant="ghost" className="p-2" onClick={() => onEdit(contact)}>
                            <ApperIcon name="Edit" size={16} />
                        </Button>
                        <Button variant="ghost" className="p-2 hover:text-error hover:bg-error/10" onClick={() => onDelete(contact)}>
                            <ApperIcon name="Trash2" size={16} />
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default ContactListItem;