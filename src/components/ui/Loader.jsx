import React from 'react';

const Loader = ({ fullScreen = false, size = 'lg', text }) => {
    const sizes = {
        xs: "loading-xs",
        sm: "loading-sm",
        md: "loading-md",
        lg: "loading-lg",
    };

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-100/80 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                    <span className={`loading loading-spinner text-primary ${sizes[size]}`}></span>
                    {text && <p className="text-gray-600 font-medium animate-pulse">{text}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-4">
            <span className={`loading loading-spinner text-primary ${sizes[size]}`}></span>
        </div>
    );
};

export default Loader;
