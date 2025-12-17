import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { UserCheck, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const BecomeTeacherModal = ({ isOpen, onClose, refetchRole }) => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Info, 2: Confirm

    if (!isOpen) return null;

    const handleRequest = async () => {
        setLoading(true);
        try {
            await axiosSecure.post('/role-requests', {
                userName: user.displayName,
                userEmail: user.email
            });
            toast.success("Request sent successfully! Admin will review it.");
            onClose();
            setStep(1); // Reset
        } catch (error) {
            console.error(error);
            if (error.response?.status === 409) {
                toast.error("You already have a pending request.");
                onClose();
            } else {
                toast.error("Failed to send request.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full animate-fade-in relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    ✕
                </button>

                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 mb-6">
                        <svg className="w-8 h-8 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Become a Tutor
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        You need to be a registered tutor to apply for tuitions. Do you want to send a request to the admin to upgrade your account?
                    </p>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleRequest}
                            disabled={loading}
                            className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Sending...
                                </>
                            ) : (
                                "Send Request"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BecomeTeacherModal;
