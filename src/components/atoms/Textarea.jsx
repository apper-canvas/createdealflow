import React from 'react';

const Textarea = ({ className = '', value, onChange, placeholder, rows = 3, ...rest }) => {
    const defaultStyles = 'w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary';
    const combinedClassName = `${defaultStyles} ${className}`.trim();

    return (
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className={combinedClassName}
            {...rest}
        />
    );
};

export default Textarea;