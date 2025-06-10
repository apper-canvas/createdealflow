import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Card from '@/components/molecules/Card';
import Button from '@/components/atoms/Button';

const PipelineColumn = ({ stage, deals, getCompanyName, handleStageChange, stageIndex }) => {
    const stageIcons = {
        'lead': 'ArrowLeft',
        'negotiation': 'ArrowRight',
        'closed-won': 'CheckCircle',
        'closed-lost': 'XCircle'
    };

    return (
        <div className="space-y-4">
            <div className={`${stage.color} text-white p-4 rounded-lg`}>
                <Heading level={2} className="font-heading font-semibold">{stage.label}</Heading>
                <Paragraph className="text-sm opacity-90">
                    {stage.count} deals • ${stage.value.toLocaleString()}
                </Paragraph>
            </div>

            <div className="space-y-3 min-h-[200px]">
                {deals.length === 0 ? (
                    <Card className="border-2 border-dashed border-surface-300 text-center">
                        <ApperIcon name="Plus" size={24} className="text-surface-400 mx-auto mb-2" />
                        <Paragraph className="text-sm text-surface-500">No deals in this stage</Paragraph>
                    </Card>
                ) : (
                    deals.map((deal, dealIndex) => (
                        <motion.div
                            key={deal.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: stageIndex * 0.1 + dealIndex * 0.05 }}
                            className="bg-white rounded-lg p-4 shadow-sm border border-surface-200 hover:shadow-md transition-shadow cursor-move"
                        >
                            <div className="space-y-3">
                                <div>
                                    <Heading level={3} className="font-semibold break-words">{deal.title}</Heading>
                                    <Paragraph className="text-lg font-bold text-primary">
                                        ${deal.value.toLocaleString()}
                                    </Paragraph>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <ApperIcon name="Building2" size={12} className="text-surface-400" />
                                        <Paragraph className="text-xs break-words">
                                            {getCompanyName(deal.companyId)}
                                        </Paragraph>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <ApperIcon name="Calendar" size={12} className="text-surface-400" />
                                        <Paragraph className="text-xs">
                                            {new Date(deal.createdAt).toLocaleDateString()}
                                        </Paragraph>
                                    </div>
                                </div>

                                {deal.notes && (
                                    <Paragraph className="text-xs break-words line-clamp-2">
                                        {deal.notes}
                                    </Paragraph>
                                )}

                                <div className="flex space-x-1 pt-2 border-t border-surface-100">
                                    {Object.keys(stageIcons)
                                        .filter(sValue => sValue !== deal.stage)
                                        .map(targetStageValue => (
                                            <Button
                                                key={targetStageValue}
                                                onClick={() => handleStageChange(deal.id, targetStageValue)}
                                                variant="ghost"
                                                className="flex-1 px-2 py-1 text-xs text-surface-600 hover:text-surface-900 hover:bg-surface-100"
                                                title={`Move to ${targetStageValue.charAt(0).toUpperCase() + targetStageValue.slice(1)}`}
                                            >
                                                <ApperIcon name={stageIcons[targetStageValue]} size={12} />
                                            </Button>
                                        ))}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PipelineColumn;