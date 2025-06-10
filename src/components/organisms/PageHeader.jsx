import React from 'react';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const PageHeader = ({ title, description, primaryButtonText, primaryButtonIcon, onPrimaryButtonClick }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
                <Heading level={1}>{title}</Heading>
                <Paragraph>{description}</Paragraph>
            </div>
            {onPrimaryButtonClick && (
                <Button onClick={onPrimaryButtonClick}>
                    {primaryButtonIcon && <ApperIcon name={primaryButtonIcon} size={16} className="inline mr-2" />}
                    {primaryButtonText}
                </Button>
            )}
        </div>
    );
};

export default PageHeader;