import React, { forwardRef } from 'react';

const Select = forwardRef(({
    label,
    error,
    options = [],
    className = '',
    placeholder = 'Select an option',
    ...props
}, ref) => {
    return (
        <div className="form-control w-full">
            {label && (
                <label className="label">
                    <span className="label-text font-medium text-gray-700 dark:text-gray-300">{label}</span>
                </label>
            )}
            <select
                ref={ref}
                className={`select select-bordered w-full focus:select-primary transition-all duration-200 ${error ? 'select-error' : ''
                    } ${className}`}
                {...props}
            >
                <option value="" disabled>{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value || option} value={option.value || option}>
                        {option.label || option}
                    </option>
                ))}
            </select>
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
        </div>
    );
});

Select.displayName = 'Select';

export default Select;
