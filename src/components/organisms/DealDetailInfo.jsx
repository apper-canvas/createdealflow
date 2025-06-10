import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Card from '@/components/molecules/Card';
import DealStageTag from '@/components/molecules/DealStageTag';
import DetailSectionHeader from '@/components/molecules/DetailSectionHeader';

const DealDetailInfo = ({ deal, onEdit }) => {
    return (
        <Card>
            <DetailSectionHeader title="Deal Information" onEdit={onEdit} />
            <div className="space-y-4">
                <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <ApperIcon name="DollarSign" size={24} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <Heading level={3} className="text-xl break-words">{deal.title}</Heading>
                        <Paragraph className="text-2xl font-bold text-primary">${deal.value.toLocaleString()}</Paragraph>
                        <div className="mt-2">
                            <DealStageTag stage={deal.stage} className="px-3 py-1" />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                        <ApperIcon name="Calendar" size={16} className="text-surface-400" />
                        <Paragraph>Created on {new Date(deal.createdAt).toLocaleDateString()}</Paragraph>
                    </div>

                    {deal.closedAt && (
                        <div className="flex items-center space-x-3">
                            <ApperIcon name="CheckCircle" size={16} className="text-surface-400" />
                            <Paragraph>Closed on {new Date(deal.closedAt).toLocaleDateString()}</Paragraph>
                        </div>
                    )}
                </div>

                {deal.notes && (
                    <div className="pt-4 border-t border-surface-200">
                        <Heading level={4} className="mb-2">Notes</Heading>
                        <Paragraph className="break-words">{deal.notes}</Paragraph>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default DealDetailInfo;