import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Card from '@/components/molecules/Card';
import DetailSectionHeader from '@/components/molecules/DetailSectionHeader';
import DealStageTag from '@/components/molecules/DealStageTag';

const CompanyDetailDeals = ({ deals, onAddDeal, onViewDeal }) => {
    return (
        <Card>
            <DetailSectionHeader title={`Deals (${deals.length})`} onAdd={onAddDeal} actionType="add" buttonText="Add Deal" />
            {deals.length === 0 ? (
                <div className="text-center py-8">
                    <ApperIcon name="DollarSign" size={32} className="text-surface-300 mx-auto mb-3" />
                    <Paragraph className="text-surface-600">No deals yet</Paragraph>
                    <Paragraph className="text-sm text-surface-500">Create deals for this company</Paragraph>
                </div>
            ) : (
                <div className="space-y-3">
                    {deals.map((deal, index) => (
                        <motion.div
                            key={deal.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => onViewDeal(deal.id)}
                            className="p-3 hover:bg-surface-50 rounded-lg cursor-pointer transition-colors border border-surface-200"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Paragraph className="font-medium text-surface-900 break-words">{deal.title}</Paragraph>
                                    <DealStageTag stage={deal.stage} />
                                </div>
                                <Paragraph className="text-lg font-bold text-primary">
                                    ${deal.value.toLocaleString()}
                                </Paragraph>
                                {deal.notes && (
                                    <Paragraph className="text-sm break-words line-clamp-2">
                                        {deal.notes}
                                    </Paragraph>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default CompanyDetailDeals;