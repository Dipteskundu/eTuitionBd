import React, { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    error,
    type = 'text',
    className = '',
    placeholder = '',
    icon,
    ...props
}, ref) => {
    return (
        <div className="form-control w-full">
            {label && (
                <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">{label}</span>
                </label>
            )}
            <div className="relative">
                <input
                    ref={ref}
                    type={type}
                    placeholder={placeholder}
                    className={`input input-bordered w-full focus:input-primary transition-all duration-200 ${error ? 'input-error' : ''
                        } ${icon ? 'pl-10' : ''} ${className}`}
                    {...props}
                />
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}
            </div>
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
