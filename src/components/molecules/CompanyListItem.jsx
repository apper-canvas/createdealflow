import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import Button from '@/components/atoms/Button';
import Card from '@/components/molecules/Card';
import CompanyAvatar from '@/components/molecules/CompanyAvatar';

const CompanyListItem = ({ company, index, onEdit, onDelete, onViewDetails }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Card className="hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                            <CompanyAvatar />
                            <div className="flex-1 min-w-0">
                                <Heading
                                    level={2}
                                    className="cursor-pointer hover:text-primary break-words"
                                    onClick={() => onViewDetails(company.id)}
                                >
                                    {company.name}
                                </Heading>
                                <Paragraph className="break-words">{company.industry}</Paragraph>
                                {company.website && (
                                    <a
                                        href={company.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:text-primary/80 text-sm break-all"
                                        onClick={(e) => e.stopPropagation()} // Prevent card click
                                    >
                                        {company.website}
                                    </a>
                                )}
                            </div>
                        </div>
                        {company.notes && (
                            <Paragraph className="mt-3 text-sm break-words">{company.notes}</Paragraph>
                        )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                        <Button variant="ghost" className="p-2" onClick={() => onEdit(company)}>
                            <ApperIcon name="Edit" size={16} />
                        </Button>
                        <Button variant="ghost" className="p-2 hover:text-error hover:bg-error/10" onClick={() => onDelete(company)}>
                            <ApperIcon name="Trash2" size={16} />
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default CompanyListItem;