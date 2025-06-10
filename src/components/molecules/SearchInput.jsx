import React from 'react';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const SearchInput = ({ searchTerm, onSearchTermChange, placeholder = 'Search...', className = '' }) => {
    return (
        <div className={`relative ${className}`}>
            <ApperIcon 
                name="Search" 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" 
            />
            <Input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                className="pl-10 pr-4 py-3"
            />
        </div>
    );
};

export default SearchInput;