import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
    children,
    title,
    subtitle,
    image,
    actions,
    className = '',
    compact = false,
    bordered = true,
    hover = true,
    glass = false,
    gradient = false,
    ...props
}) => {
    const baseClasses = "card overflow-hidden";

    const variantClasses = glass
        ? "glass backdrop-blur-xl bg-white/90 dark:bg-gray-800/80 border border-white/20 dark:border-white/10 shadow-lg"
        : gradient
            ? "border border-primary/20 bg-base-100"
            : `bg-base-100 ${bordered ? 'border border-base-200' : ''}`;

    const hoverClasses = hover
        ? "hover:shadow-2xl hover:-translate-y-2 hover:shadow-primary/10 transition-all duration-300"
        : "shadow-md";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            whileHover={hover ? { y: -8, transition: { duration: 0.2 } } : {}}
            className={`${baseClasses} ${variantClasses} ${hoverClasses} ${compact ? 'card-compact' : ''} ${className}`}
            {...props}
        >
            {image && (
                <figure className="relative overflow-hidden">
                    <motion.img
                        src={image}
                        alt={title || 'Card image'}
                        className="w-full object-cover h-48"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    />
                    {gradient && (
                        <div className="absolute inset-0 bg-black/40" />
                    )}
                </figure>
            )}
            <div className={`card-body ${compact ? 'p-4' : 'p-6'}`}>
                {title && (
                    <h2 className="card-title text-base-content font-heading text-xl font-bold">
                        {title}
                    </h2>
                )}
                {subtitle && (
                    <p className="text-base-content/60 text-sm -mt-1">
                        {subtitle}
                    </p>
                )}
                <div className="text-base-content/80">
                    {children}
                </div>
                {actions && (
                    <div className="card-actions justify-end mt-4 pt-4 border-t border-base-200">
                        {actions}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Card;
