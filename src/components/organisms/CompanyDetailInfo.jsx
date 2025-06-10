import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Card from '@/components/molecules/Card';
import DetailSectionHeader from '@/components/molecules/DetailSectionHeader';
import CompanyAvatar from '@/components/molecules/CompanyAvatar';

const CompanyDetailInfo = ({ company, onEdit }) => {
    return (
        <Card>
            <DetailSectionHeader title="Company Information" onEdit={onEdit} />
            <div className="space-y-4">
                <div className="flex items-start space-x-3">
                    <CompanyAvatar size={24} />
                    <div className="flex-1 min-w-0">
                        <Heading level={3} className="text-xl break-words">{company.name}</Heading>
                        <Paragraph className="break-words">{company.industry || 'No industry specified'}</Paragraph>
                    </div>
                </div>

                {company.website && (
                    <div className="flex items-center space-x-3">
                        <ApperIcon name="Globe" size={16} className="text-surface-400" />
                        <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 break-all"
                        >
                            {company.website}
                        </a>
                    </div>
                )}

                <div className="flex items-center space-x-3">
                    <ApperIcon name="Calendar" size={16} className="text-surface-400" />
                    <Paragraph>Created on {new Date(company.createdAt).toLocaleDateString()}</Paragraph>
                </div>

                {company.notes && (
                    <div className="pt-4 border-t border-surface-200">
                        <Heading level={4} className="mb-2">Notes</Heading>
                        <Paragraph className="break-words">{company.notes}</Paragraph>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default CompanyDetailInfo;