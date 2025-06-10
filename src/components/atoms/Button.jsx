import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className = '', variant = 'primary', onClick, whileHover, whileTap, ...rest }) => {
    let baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out';
    let variantStyles = '';

    switch (variant) {
        case 'primary':
            variantStyles = 'bg-gradient-primary text-white shadow-sm hover:shadow-md';
            break;
        case 'secondary':
            variantStyles = 'bg-surface-200 text-surface-800 hover:bg-surface-300';
            break;
        case 'outline':
            variantStyles = 'border border-surface-300 text-surface-700 hover:bg-surface-50';
            break;
        case 'ghost':
            variantStyles = 'text-primary hover:text-primary/80 hover:bg-primary/5';
            break;
        case 'danger':
            variantStyles = 'bg-error text-white shadow-sm hover:shadow-md';
            break;
        case 'info':
            variantStyles = 'bg-info text-white shadow-sm hover:shadow-md';
            break;
        case 'warning':
            variantStyles = 'bg-warning text-white shadow-sm hover:shadow-md';
            break;
        case 'success':
            variantStyles = 'bg-success text-white shadow-sm hover:shadow-md';
            break;
        default:
            variantStyles = 'bg-gradient-primary text-white shadow-sm hover:shadow-md';
            break;
    }

    const combinedClassName = `${baseStyles} ${variantStyles} ${className}`.trim();

    return (
        <motion.button
            whileHover={whileHover || { scale: 1.05 }}
            whileTap={whileTap || { scale: 0.95 }}
            onClick={onClick}
            className={combinedClassName}
            {...rest}
        >
            {children}
        </motion.button>
    );
};

export default Button;