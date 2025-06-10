import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ActionButton = ({ label, icon, color, onClick, delay = 0 }) => {
    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`${color} text-white p-4 rounded-lg flex flex-col items-center space-y-2 font-medium hover:shadow-lg transition-shadow`}
        >
            <ApperIcon name={icon} size={24} />
            <span className="text-sm">{label}</span>
        </motion.button>
    );
};

export default ActionButton;