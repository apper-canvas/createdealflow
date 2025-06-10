import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';
import Card from '@/components/molecules/Card';
import DealStageTag from '@/components/molecules/DealStageTag'; // To reuse getStageColor helper

const dealStages = [
    { value: 'lead', label: 'Lead' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed-won', label: 'Closed Won' },
    { value: 'closed-lost', label: 'Closed Lost' }
];

const DealStageManager = ({ currentStage, onStageChange }) => {
    return (
        <Card>
            <Heading level={2} className="mb-4">Manage Stage</Heading>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {dealStages.map((stage) => (
                    <Button
                        key={stage.value}
                        onClick={() => onStageChange(stage.value)}
                        disabled={currentStage === stage.value}
                        className={`p-3 text-sm flex flex-col justify-center items-center ${
                            currentStage === stage.value
                                ? `${DealStageTag({ stage: stage.value, className: 'px-0 py-0' }).props.className} opacity-50 cursor-not-allowed` // Reusing helper for dynamic class
                                : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                        }`}
                        whileHover={currentStage === stage.value ? {} : { scale: 1.05 }} // Disable hover animation if current stage
                        whileTap={currentStage === stage.value ? {} : { scale: 0.95 }}   // Disable tap animation if current stage
                    >
                        {stage.label}
                        {currentStage === stage.value && (
                            <div className="mt-1">
                                <ApperIcon name="Check" size={12} className="mx-auto" />
                            </div>
                        )}
                    </Button>
                ))}
            </div>
        </Card>
    );
};

export default DealStageManager;