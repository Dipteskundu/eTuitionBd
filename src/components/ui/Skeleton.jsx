import React from 'react';

const Skeleton = ({ className = '', height, width, variant = 'text' }) => {
    // variant: 'text', 'circular', 'rectangular'

    const baseClasses = "animate-pulse bg-base-300";
    const variantClasses = {
        text: "rounded",
        circular: "rounded-full",
        rectangular: "rounded-xl",
    };

    const style = {
        height: height,
        width: width,
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        />
    );
};

export const CardSkeleton = () => {
    return (
        <div className="card bg-base-100 shadow-xl overflow-hidden border border-base-200">
            <figure className="relative h-48 w-full bg-base-200 animate-pulse">
                {/* Image Placeholder */}
            </figure>
            <div className="card-body p-6 space-y-4">
                {/* Title and Meta */}
                <div className="space-y-2">
                    <div className="h-6 w-3/4 bg-base-300 rounded animate-pulse"></div>
                    <div className="h-4 w-1/2 bg-base-300 rounded animate-pulse"></div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <div className="h-3 w-full bg-base-300 rounded animate-pulse"></div>
                    <div className="h-3 w-5/6 bg-base-300 rounded animate-pulse"></div>
                </div>

                {/* Meta Info Row */}
                <div className="flex justify-between items-center pt-2">
                    <div className="h-8 w-20 bg-base-300 rounded-full animate-pulse"></div>
                    <div className="h-8 w-16 bg-base-300 rounded-full animate-pulse"></div>
                </div>

                {/* Button */}
                <div className="pt-2">
                    <div className="h-10 w-full bg-base-300 rounded-lg animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default Skeleton;
