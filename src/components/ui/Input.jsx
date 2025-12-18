import React, { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef((
    {
        label,
        error,
        type = 'text',
        className = '',
        placeholder = '',
        leftIcon,
        rightIcon,
        maxLength,
        showCharCount = false,
        floating = false,
        fullWidth, // Consume fullWidth to prevent it from passing to DOM via ...props
        togglePassword, // Destructure to prevent passing to DOM
        ...props
    },
    ref
) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState(props.value || props.defaultValue || '');

    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    const handleChange = (e) => {
        setValue(e.target.value);
        if (props.onChange) props.onChange(e);
    };

    return (
        <div className="form-control w-full">
            <div className="relative">
                {/* Floating Label */}
                {floating && label && (
                    <motion.label
                        className={`absolute left-3 transition-all duration-200 pointer-events-none ${isFocused || value
                            ? '-top-2 text-xs bg-base-100 px-2 text-primary font-medium'
                            : 'top-3 text-base text-base-content/50'
                            } ${leftIcon ? 'left-10' : 'left-3'}`}
                        animate={{
                            y: isFocused || value ? -8 : 0,
                            scale: isFocused || value ? 0.85 : 1,
                        }}
                    >
                        {label}
                    </motion.label>
                )}

                {/* Static Label */}
                {!floating && label && (
                    <label className="label">
                        <span className="label-text font-medium text-base-content">
                            {label}
                        </span>
                    </label>
                )}

                <div className="relative">
                    {/* Left Icon */}
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40">
                            {React.isValidElement(leftIcon) ? leftIcon : React.createElement(leftIcon, { size: 20 })}
                        </div>
                    )}

                    {/* Input Field */}
                    <motion.input
                        ref={ref}
                        type={inputType}
                        placeholder={floating ? '' : placeholder}
                        className={`input input-bordered w-full input-focus transition-all duration-200 ${error
                            ? 'input-error focus:ring-error/50 animate-wiggle'
                            : 'focus:ring-2 focus:ring-primary/50 focus:border-primary'
                            } ${leftIcon ? 'pl-10' : ''} ${rightIcon || isPassword ? 'pr-10' : ''
                            } ${className}`}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onChange={handleChange}
                        value={value}
                        maxLength={maxLength}
                        {...props}
                    />

                    {/* Right Icon or Password Toggle */}
                    {(rightIcon || isPassword) && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {isPassword ? (
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-base-content/40 hover:text-base-content transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            ) : (
                                <div className="text-base-content/40">
                                    {rightIcon && (React.isValidElement(rightIcon) ? rightIcon : React.createElement(rightIcon, { size: 20 }))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Character Count */}
                {showCharCount && maxLength && (
                    <div className="label">
                        <span className="label-text-alt text-base-content/50">
                            {value.length}/{maxLength}
                        </span>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <motion.label
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="label"
                    >
                        <span className="label-text-alt text-error font-medium">{error}</span>
                    </motion.label>
                )}
            </div>
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
