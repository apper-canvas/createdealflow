import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Button from '@/components/atoms/Button';
import Card from '@/components/molecules/Card';

const ErrorState = ({ message, onRetry }) => {
    return (
        <Card className="p-8 text-center">
            <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
            <Heading level={2} className="mb-2">Error Loading Data</Heading>
            <Paragraph className="mb-4">{message || 'Something went wrong.'}</Paragraph>
            {onRetry && <Button onClick={onRetry}>Try Again</Button>}
        </Card>
    );
};

export default ErrorState;