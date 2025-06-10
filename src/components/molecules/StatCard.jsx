import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/molecules/Card';
import Heading from '@/components/atoms/Heading';
import Paragraph from '@/components/atoms/Paragraph';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ label, value, icon, color, bg, onClick, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
            className="cursor-pointer hover:shadow-md transition-shadow"
        >
            <Card>
                <div className="flex items-center justify-between">
                    <div>
                        <Paragraph className="text-sm font-medium">{label}</Paragraph>
                        <Heading level={3} className="mt-1">{value}</Heading>
                    </div>
                    <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center`}>
                        <ApperIcon name={icon} size={24} className={color} />
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default StatCard;