import React from 'react';

const Heading = ({ level = 2, children, className = '' }) => {
    const Tag = `h${level}`;
    let defaultStyles = 'font-heading font-semibold text-surface-900';

    switch (level) {
        case 1:
            defaultStyles = 'text-2xl font-heading font-bold text-surface-900';
            break;
        case 2:
            defaultStyles = 'text-lg font-heading font-semibold text-surface-900';
            break;
        case 3:
            defaultStyles = 'text-xl font-semibold text-surface-900';
            break;
        case 4:
            defaultStyles = 'font-medium text-surface-900';
            break;
        default:
            break;
    }

    const combinedClassName = `${defaultStyles} ${className}`.trim();

    return <Tag className={combinedClassName}>{children}</Tag>;
};

export default Heading;