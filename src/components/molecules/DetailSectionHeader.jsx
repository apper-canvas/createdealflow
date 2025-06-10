import React from 'react';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';

const DetailSectionHeader = ({ title, onEdit, onAdd, buttonText = 'Edit', actionType = 'edit' }) => {
    return (
        <div className="flex items-center justify-between mb-4">
            <Heading level={2}>{title}</Heading>
            {actionType === 'edit' && onEdit && (
                <Button variant="ghost" className="px-3 py-1 text-sm" onClick={onEdit}>
                    {buttonText}
                </Button>
            )}
            {actionType === 'add' && onAdd && (
                <Button variant="ghost" className="px-3 py-1 text-sm" onClick={onAdd}>
                    {buttonText}
                </Button>
            )}
        </div>
    );
};

export default DetailSectionHeader;