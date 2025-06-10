import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Card from '@/components/molecules/Card';
import CompanyAvatar from '@/components/molecules/CompanyAvatar';

const ContactDetailCompany = ({ company, onCompanyClick }) => {
    if (!company) return null;

    return (
        <Card>
            <Heading level={2} className="mb-4">Company</Heading>
            <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => onCompanyClick(company.id)}
                className="flex items-center space-x-3 p-4 hover:bg-surface-50 rounded-lg cursor-pointer transition-colors border border-surface-200"
            >
                <CompanyAvatar size={20} />
                <div className="flex-1 min-w-0">
                    <Heading level={3}>{company.name}</Heading>
                    <Paragraph className="break-words">{company.industry || 'No industry specified'}</Paragraph>
                    {company.website && (
                        <Paragraph className="text-sm break-all text-surface-500">{company.website}</Paragraph>
                    )}
                </div>
                <ApperIcon name="ExternalLink" size={16} className="text-surface-400" />
            </motion.div>
        </Card>
    );
};

export default ContactDetailCompany;