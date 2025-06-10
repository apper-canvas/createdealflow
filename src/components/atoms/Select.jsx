import React from 'react';

const Select = ({ children, className = '', value, onChange, ...rest }) => {
    const defaultStyles = 'w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary';
    const combinedClassName = `${defaultStyles} ${className}`.trim();

    return (
        <select
            value={value}
            onChange={onChange}
            className={combinedClassName}
            {...rest}
        >
            {children}
        </select>
    );
};

export default Select;