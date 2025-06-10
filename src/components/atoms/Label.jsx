import React from 'react';

const Label = ({ children, htmlFor, className = '' }) => {
    const defaultStyles = 'block text-sm font-medium text-surface-700 mb-1';
    const combinedClassName = `${defaultStyles} ${className}`.trim();

    return (
        <label htmlFor={htmlFor} className={combinedClassName}>
            {children}
        </label>
    );
};

export default Label;