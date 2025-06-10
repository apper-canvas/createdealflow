import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Card from '@/components/molecules/Card';
import ContactAvatar from '@/components/molecules/ContactAvatar';
import Button from '@/components/atoms/Button';

const DealDetailSidebar = ({ company, contacts, onCompanyClick, onContactClick, onEditDeal, onViewPipeline, deal }) => {
    return (
        <div className="space-y-6">
            {company && (
                <Card>
                    <Heading level={3} className="mb-4">Company</Heading>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => onCompanyClick(company.id)}
                        className="flex items-center space-x-3 p-3 hover:bg-surface-50 rounded-lg cursor-pointer transition-colors border border-surface-200"
                    >
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <ApperIcon name="Building2" size={16} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <Paragraph className="font-medium text-surface-900 break-words">{company.name}</Paragraph>
                            <Paragraph className="text-sm break-words">{company.industry || 'No industry'}</Paragraph>
                        </div>
                        <ApperIcon name="ExternalLink" size={14} className="text-surface-400" />
                    </motion.div>
                </Card>
            )}

            {contacts.length > 0 && (
                <Card>
                    <Heading level={3} className="mb-4">Contacts ({contacts.length})</Heading>
                    <div className="space-y-3">
                        {contacts.map((contact, index) => (
                            <motion.div
                                key={contact.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => onContactClick(contact.id)}
                                className="flex items-center space-x-3 p-3 hover:bg-surface-50 rounded-lg cursor-pointer transition-colors"
                            >
                                <ContactAvatar firstName={contact.firstName} lastName={contact.lastName} size={14} />
                                <div className="flex-1 min-w-0">
                                    <Paragraph className="font-medium text-surface-900 text-sm break-words">
                                        {contact.firstName} {contact.lastName}
                                    </Paragraph>
                                    <Paragraph className="text-xs break-words">{contact.role || 'No role'}</Paragraph>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            )}

            <Card>
                <Heading level={3} className="mb-4">Quick Actions</Heading>
                <div className="space-y-3">
                    <Button variant="ghost" className="flex items-center space-x-3 p-3 w-full" onClick={onEditDeal}>
                        <ApperIcon name="Edit" size={16} />
                        <span className="font-medium">Edit Deal</span>
                    </Button>
                    <Button variant="ghost" className="flex items-center space-x-3 p-3 w-full" onClick={onViewPipeline}>
                        <ApperIcon name="BarChart3" size={16} />
                        <span className="font-medium">View Pipeline</span>
                    </Button>
                </div>
            </Card>

            <Card>
                <Heading level={3} className="mb-4">Deal Statistics</Heading>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <Paragraph className="text-surface-600">Days Open</Paragraph>
                        <Paragraph className="font-semibold text-surface-900">
                            {Math.floor((new Date() - new Date(deal.createdAt)) / (1000 * 60 * 60 * 24))}
                        </Paragraph>
                    </div>
                    <div className="flex justify-between">
                        <Paragraph className="text-surface-600">Stage</Paragraph>
                        <Paragraph className="font-semibold text-surface-900">
                            <DealStageTag stage={deal.stage} className="px-0 py-0 text-surface-900" />
                        </Paragraph>
                    </div>
                    <div className="flex justify-between">
                        <Paragraph className="text-surface-600">Value</Paragraph>
                        <Paragraph className="font-semibold text-primary">
                            ${deal.value.toLocaleString()}
                        </Paragraph>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default DealDetailSidebar;