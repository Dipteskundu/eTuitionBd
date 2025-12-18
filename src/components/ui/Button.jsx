import React, { useState } from 'react';
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
    leftIcon,
    rightIcon,
    fullWidth = false,
    isLoading, // Destructure to prevent passing to DOM
    ...props
}) => {
    // Normalize loading state
    const activeLoading = loading || isLoading;


    const [ripples, setRipples] = useState([]);

    const baseClasses = "btn font-medium transition-all duration-300 relative overflow-hidden";

    const variants = {
        primary: "btn-primary text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40",
        secondary: "btn-secondary text-white shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40",
        accent: "btn-accent text-white shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40",
        outline: "btn-outline border-2 hover:scale-105",
        ghost: "btn-ghost hover:bg-base-200",
        link: "btn-link underline-offset-4 hover:underline",
        error: "btn-error text-white shadow-lg shadow-error/30 hover:shadow-xl hover:shadow-error/40",
        success: "btn-success text-white shadow-lg shadow-success/30 hover:shadow-xl hover:shadow-success/40",
        gradient: "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/30 hover:shadow-glow border-none",
        danger: "bg-gradient-to-r from-error-500 to-warning-500 text-white shadow-lg shadow-error-500/30 hover:shadow-xl border-none",
    };

    const sizes = {
        xs: "btn-xs text-xs px-3 py-1",
        sm: "btn-sm text-sm px-4 py-2",
        md: "btn-md text-base px-6 py-2.5",
        lg: "btn-lg text-lg px-8 py-3",
        xl: "text-xl px-10 py-4 h-auto min-h-0",
    };

    const handleClick = (e) => {
        if (disabled || loading) return;

        // Create ripple effect
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const newRipple = {
            x,
            y,
            size,
            id: Date.now(),
        };

        setRipples([...ripples, newRipple]);

        // Remove ripple after animation
        setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 600);

        if (onClick) onClick(e);
    };

    return (
        <motion.button
            whileHover={{ scale: disabled || activeLoading ? 1 : 1.02 }}
            whileTap={{ scale: disabled || activeLoading ? 1 : 0.98 }}
            type={type}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
            disabled={disabled || activeLoading}
            onClick={handleClick}
            {...props}
        >
            {/* Ripple Effect */}
            {ripples.map((ripple) => (
                <span
                    key={ripple.id}
                    className="absolute rounded-full bg-white/30 animate-ping"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: ripple.size,
                        height: ripple.size,
                    }}
                />
            ))}

            {/* Button Content */}
            <span className="relative flex items-center justify-center gap-2">
                {activeLoading && <span className="loading loading-spinner loading-sm"></span>}
                {!activeLoading && leftIcon && <span className="inline-flex">
                    {React.isValidElement(leftIcon) ? leftIcon : React.createElement(leftIcon, { size: size === 'lg' ? 20 : 18 })}
                </span>}
                {!activeLoading && children}
                {!activeLoading && rightIcon && <span className="inline-flex">
                    {React.isValidElement(rightIcon) ? rightIcon : React.createElement(rightIcon, { size: size === 'lg' ? 20 : 18 })}
                </span>}
            </span>
        </motion.button>
    );
};

export default Button;
