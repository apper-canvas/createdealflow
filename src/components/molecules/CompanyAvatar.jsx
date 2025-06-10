import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const CompanyAvatar = ({ size = 20 }) => {
    const sizeClasses = {
        16: 'w-10 h-10',
        20: 'w-12 h-12',
        24: 'w-16 h-16',
    };
    const iconSize = size === 16 ? 16 : size === 20 ? 20 : 24;

    return (
        <div className={`${sizeClasses[size] || 'w-12 h-12'} bg-gradient-primary rounded-lg flex items-center justify-center`}>
            <ApperIcon name="Building2" size={iconSize} className="text-white" />
        </div>
    );
};

export default CompanyAvatar;