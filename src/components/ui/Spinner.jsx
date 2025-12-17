import React from 'react';
import { motion } from 'framer-motion';

const Spinner = ({
    size = 'md',
    variant = 'circle',
    color = 'primary',
    className = '',
    fullScreen = false,
}) => {
    const sizes = {
        xs: 'w-4 h-4',
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    const colors = {
        primary: 'text-primary',
        secondary: 'text-secondary',
        accent: 'text-accent',
        white: 'text-white',
    };

    const spinnerVariants = {
        circle: (
            <div className={`loading loading-spinner ${sizes[size]} ${colors[color]}`}></div>
        ),
        dots: (
            <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className={`rounded-full bg-current ${size === 'xs' ? 'w-1 h-1' : size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-5 h-5'} ${colors[color]}`}
                        animate={{
                            y: [0, -10, 0],
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.1,
                        }}
                    />
                ))}
            </div>
        ),
        pulse: (
            <motion.div
                className={`rounded-full bg-current ${sizes[size]} ${colors[color]}`}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                }}
            />
        ),
        ring: (
            <div className={`relative ${sizes[size]}`}>
                <motion.div
                    className={`absolute inset-0 rounded-full border-4 border-current ${colors[color]} opacity-25`}
                />
                <motion.div
                    className={`absolute inset-0 rounded-full border-4 border-current border-t-transparent ${colors[color]}`}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
            </div>
        ),
    };

    const content = (
        <div className={`flex items-center justify-center ${className}`}>
            {spinnerVariants[variant]}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-base-100/80 backdrop-blur-sm flex items-center justify-center z-50">
                {content}
            </div>
        );
    }

    return content;
};

export default Spinner;
