import React from 'react';

const Card = ({ children, className = '' }) => {
    const defaultStyles = 'bg-white rounded-lg p-6 shadow-sm border border-surface-200';
    const combinedClassName = `${defaultStyles} ${className}`.trim();

    return (
        <div className={combinedClassName}>
            {children}
        </div>
    );
};

export default Card;