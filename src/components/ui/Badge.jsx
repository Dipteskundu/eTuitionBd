import React from 'react';

const Badge = ({
    children,
    variant = 'neutral',
    size = 'md',
    className = '',
    outline = false
}) => {
    const variants = {
        primary: "badge-primary text-white",
        secondary: "badge-secondary text-white",
        accent: "badge-accent text-white",
        neutral: "badge-neutral text-white",
        ghost: "badge-ghost",
        info: "badge-info text-white",
        success: "badge-success text-white",
        warning: "badge-warning text-white",
        error: "badge-error text-white",
    };

    const sizes = {
        xs: "badge-xs text-[10px]",
        sm: "badge-sm text-xs",
        md: "badge-md text-sm",
        lg: "badge-lg text-base p-4",
    };

    return (
        <div className={`badge ${variants[variant]} ${sizes[size]} ${outline ? 'badge-outline' : ''} ${className}`}>
            {children}
        </div>
    );
};

export default Badge;
