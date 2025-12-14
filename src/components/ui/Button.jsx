import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    loading = false,
    disabled = false,
    type = 'button',
    onClick,
    ...props
}) => {
    const baseClasses = "btn font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]";

    const variants = {
        primary: "btn-primary text-white shadow-lg shadow-primary/30",
        secondary: "btn-secondary text-white shadow-lg shadow-secondary/30",
        accent: "btn-accent text-white shadow-lg shadow-accent/30",
        outline: "btn-outline border-2",
        ghost: "btn-ghost hover:bg-base-200",
        link: "btn-link underline-offset-4",
        error: "btn-error text-white shadow-lg shadow-error/30",
        success: "btn-success text-white shadow-lg shadow-success/30",
    };

    const sizes = {
        xs: "btn-xs text-xs",
        sm: "btn-sm text-sm",
        md: "btn-md text-base",
        lg: "btn-lg text-lg",
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            type={type}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading && <span className="loading loading-spinner loading-sm"></span>}
            {!loading && children}
        </motion.button>
    );
};

export default Button;
