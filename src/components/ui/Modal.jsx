import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    actions,
    size = 'md',
    closeOnOverlayClick = true
}) => {
    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full m-4',
    };

    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-4 sm:p-0">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeOnOverlayClick ? onClose : undefined}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={`relative w-full ${sizes[size]} bg-base-100 rounded-lg shadow-xl sm:my-8`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-base-200">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {title}
                            </h3>
                            <button
                                onClick={onClose}
                                className="btn btn-sm btn-circle btn-ghost"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-4 relative">
                            {children}
                        </div>

                        {/* Footer */}
                        {actions && (
                            <div className="flex flex-row-reverse gap-2 px-6 py-4 border-t border-base-200 bg-base-50/50 rounded-b-lg">
                                {actions}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default Modal;
