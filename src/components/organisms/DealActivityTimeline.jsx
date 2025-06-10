import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Card from '@/components/molecules/Card';

const ActivityItem = ({ iconName, iconColor, title, time, className = '' }) => (
    <div className={`flex items-start space-x-3 ${className}`}>
        <div className={`w-8 h-8 ${iconColor}/10 rounded-lg flex items-center justify-center`}>
            <ApperIcon name={iconName} size={14} className={iconColor} />
        </div>
        <div className="flex-1 min-w-0">
            <Paragraph className="text-sm font-medium text-surface-900">{title}</Paragraph>
            <Paragraph className="text-xs text-surface-500">{time}</Paragraph>
        </div>
    </div>
);

const DealActivityTimeline = ({ deal }) => {
    return (
        <Card>
            <Heading level={2} className="mb-4">Activity Timeline</Heading>
            <div className="space-y-4">
                <ActivityItem
                    iconName="Plus"
                    iconColor="text-success"
                    title="Deal created"
                    time={`${new Date(deal.createdAt).toLocaleDateString()} at ${new Date(deal.createdAt).toLocaleTimeString()}`}
                />

                {deal.updatedAt && deal.updatedAt !== deal.createdAt && (
                    <ActivityItem
                        iconName="Edit"
                        iconColor="text-primary"
                        title="Deal updated"
                        time={`${new Date(deal.updatedAt).toLocaleDateString()} at ${new Date(deal.updatedAt).toLocaleTimeString()}`}
                    />
                )}

                {deal.closedAt && (
                    <ActivityItem
                        iconName={deal.stage === 'closed-won' ? 'CheckCircle' : 'XCircle'}
                        iconColor={deal.stage === 'closed-won' ? 'text-success' : 'text-error'}
                        title={`Deal ${deal.stage === 'closed-won' ? 'won' : 'lost'}`}
                        time={`${new Date(deal.closedAt).toLocaleDateString()} at ${new Date(deal.closedAt).toLocaleTimeString()}`}
                    />
                )}
            </div>
        </Card>
    );
};

export default DealActivityTimeline;