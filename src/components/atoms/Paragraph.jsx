import React from 'react';

const Paragraph = ({ children, className = '' }) => {
    const defaultStyles = 'text-surface-600';
    const combinedClassName = `${defaultStyles} ${className}`.trim();
    return <p className={combinedClassName}>{children}</p>;
};

export default Paragraph;