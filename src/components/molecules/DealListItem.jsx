import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Button from '@/components/atoms/Button';
import Card from '@/components/molecules/Card';
import DealStageTag from '@/components/molecules/DealStageTag';

const DealListItem = ({ deal, companyName, contactNames, stageInfo, index, onEdit, onDelete, onViewDetails }) => {
    return (
        <motion.div
            key={deal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Card className="hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                                <ApperIcon name="DollarSign" size={20} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <Heading
                                    level={2}
                                    className="cursor-pointer hover:text-primary break-words"
                                    onClick={() => onViewDetails(deal.id)}
                                >
                                    {deal.title}
                                </Heading>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-xl font-bold text-surface-900">
                                        ${deal.value.toLocaleString()}
                                    </span>
                                    <DealStageTag stage={stageInfo.value} />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <ApperIcon name="Building2" size={14} className="text-surface-400" />
                                <Paragraph className="text-sm break-words">{companyName}</Paragraph>
                            </div>
                            {deal.contactIds && deal.contactIds.length > 0 && (
                                <div className="flex items-center space-x-2">
                                    <ApperIcon name="Users" size={14} className="text-surface-400" />
                                    <Paragraph className="text-sm break-words">{contactNames}</Paragraph>
                                </div>
                            )}
                            {deal.notes && (
                                <Paragraph className="text-sm break-words mt-2">{deal.notes}</Paragraph>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                        <Button variant="ghost" className="p-2" onClick={() => onEdit(deal)}>
                            <ApperIcon name="Edit" size={16} />
                        </Button>
                        <Button variant="ghost" className="p-2 hover:text-error hover:bg-error/10" onClick={() => onDelete(deal)}>
                            <ApperIcon name="Trash2" size={16} />
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default DealListItem;