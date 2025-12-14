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
    ...props
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`card bg-base-100 ${compact ? 'card-compact' : ''} ${bordered ? 'border border-base-200' : ''
                } ${hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300' : 'shadow-md'} ${className}`}
            {...props}
        >
            {image && (
                <figure>
                    <img src={image} alt={title || 'Card image'} className="w-full object-cover h-48" />
                </figure>
            )}
            <div className="card-body">
                {title && <h2 className="card-title text-gray-800 dark:text-white">{title}</h2>}
                {subtitle && <p className="text-gray-500 text-sm mt-0">{subtitle}</p>}
                <div className="text-gray-600 dark:text-gray-300">
                    {children}
                </div>
                {actions && <div className="card-actions justify-end mt-4">{actions}</div>}
            </div>
        </motion.div>
    );
};

export default Card;
