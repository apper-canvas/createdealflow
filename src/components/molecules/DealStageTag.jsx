import React from 'react';

const DealStageTag = ({ stage, className = '' }) => {
    const getStageColor = (s) => {
        const colors = {
            'lead': 'bg-info text-white',
            'negotiation': 'bg-warning text-white',
            'closed-won': 'bg-success text-white',
            'closed-lost': 'bg-error text-white'
        };
        return colors[s] || 'bg-surface-200 text-surface-700';
    };

    const getStageLabel = (s) => {
        const labels = {
            'lead': 'Lead',
            'negotiation': 'Negotiation',
            'closed-won': 'Closed Won',
            'closed-lost': 'Closed Lost'
        };
        return labels[s] || s;
    };

    const combinedClassName = `px-2 py-1 rounded-full text-xs font-medium ${getStageColor(stage)} ${className}`.trim();

    return (
        <span className={combinedClassName}>
            {getStageLabel(stage)}
        </span>
    );
};

export default DealStageTag;