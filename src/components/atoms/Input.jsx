import React from 'react';

const Input = ({ className = '', type = 'text', value, onChange, placeholder, ...rest }) => {
    const defaultStyles = 'w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary';
    const combinedClassName = `${defaultStyles} ${className}`.trim();

    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={combinedClassName}
            {...rest}
        />
    );
};

export default Input;