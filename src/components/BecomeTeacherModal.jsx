import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { UserCheck, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const BecomeTeacherModal = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(false);

    const handleRequest = async () => {
        setLoading(true);
        try {
            await axiosSecure.post('/role-requests', {
                userName: user.displayName,
                userEmail: user.email
            });
            toast.success("Request sent successfully! Admin will review it.");
            onClose();
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
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Become a Tutor"
            size="sm"
        >
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                    <UserCheck className="w-10 h-10 text-primary" />
                </div>

                <h2 className="text-2xl font-bold mb-4">
                    Upgrade Your Account
                </h2>

                <p className="text-base-content/70 mb-8 leading-relaxed">
                    You need to be a registered tutor to apply for tuitions. Do you want to send a request to the admin to upgrade your account?
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="order-2 sm:order-1 flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleRequest}
                        isLoading={loading}
                        leftIcon={CheckCircle}
                        className="order-1 sm:order-2 flex-1 shadow-lg shadow-primary/20"
                    >
                        Send Request
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default BecomeTeacherModal;
