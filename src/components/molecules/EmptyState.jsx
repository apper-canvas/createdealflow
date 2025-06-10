import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Button from '@/components/atoms/Button';
import Card from '@/components/molecules/Card';

const EmptyState = ({ icon, title, description, buttonText, onButtonClick, showButton = true }) => {
    return (
        <Card className="p-12 text-center">
            <ApperIcon name={icon} size={48} className="text-surface-300 mx-auto mb-4" />
            <Heading level={2} className="mb-2">{title}</Heading>
            <Paragraph className="mb-6">{description}</Paragraph>
            {showButton && onButtonClick && (
                <Button onClick={onButtonClick}>{buttonText}</Button>
            )}
        </Card>
    );
};

export default EmptyState;