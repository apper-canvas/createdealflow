import React from 'react';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Button from '@/components/atoms/Button';

const DetailHeader = ({ title, subtitle, backPath }) => {
    const navigate = useNavigate();
    return (
        <div className="flex items-center space-x-4">
            <Button variant="ghost" className="p-2 text-surface-500" onClick={() => navigate(backPath)}>
                <ApperIcon name="ArrowLeft" size={20} />
            </Button>
            <div>
                <Heading level={1}>{title}</Heading>
                <Paragraph>{subtitle}</Paragraph>
            </div>
        </div>
    );
};

export default DetailHeader;