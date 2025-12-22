import React, { useState } from 'react';
import { CreditCard, DollarSign, CheckCircle, Shield, Lock, CreditCard as CardIcon } from 'lucide-react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import useAxiosSecure from '../hooks/useAxiosSecure';
import useAuth from '../hooks/useAuth';

const PaymentModal = ({ isOpen, onClose, application, tuition, onSuccess }) => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [step, setStep] = useState(1); // 1: Review, 2: Payment
    const [loading, setLoading] = useState(false);

    if (!isOpen || !application || !tuition) return null;

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate secure processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        setLoading(false);
        onPaymentComplete(application);
        onClose();
        setStep(1); // Reset
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => { onClose(); setStep(1); }}
            title={step === 1 ? "Review & Confirm Details" : "Secure Checkout"}
            maxWidth="max-w-lg"
        >
            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                    >
                        {/* Order Summary Card */}
                        <div className="bg-base-200/50 p-6 rounded-2xl border border-base-200 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <DollarSign size={100} />
                            </div>

                            <h3 className="text-sm font-bold uppercase text-base-content/50 mb-4 tracking-wider">Order Summary</h3>

                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-center border-b border-base-content/10 pb-2">
                                    <span className="font-medium">Tuition Subject</span>
                                    <span className="font-bold">{tuition.subject}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-base-content/10 pb-2">
                                    <span className="font-medium">Selected Tutor</span>
                                    <span className="font-bold text-primary">{application.tutorName || application.tutorEmail}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-base-content/10 pb-2">
                                    <span className="font-medium">Service Fee</span>
                                    <span className="text-base-content/60 line-through">BDT 500</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 text-lg">
                                    <span className="font-bold">Total Payable</span>
                                    <span className="font-bold text-success">BDT {tuition.salary}</span>
                                </div>
                            </div>
                        </div>

                        <div className="alert alert-info shadow-sm py-2">
                            <Shield size={16} />
                            <span className="text-xs">Your payment is held in escrow until the tutor accepts the assignment.</span>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-3">
                            <Button variant="ghost" onClick={onClose} className="order-2 sm:order-1 flex-1">Cancel</Button>
                            <Button
                                variant="primary"
                                rightIcon={CheckCircle}
                                onClick={() => setStep(2)}
                                className="order-1 sm:order-2 flex-1 shadow-lg shadow-primary/20"
                            >
                                Proceed to Payment
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-4 bg-success/10 p-4 rounded-xl border border-success/20 text-success">
                            <Lock size={24} />
                            <div>
                                <h4 className="font-bold text-sm">Encrypted Transaction</h4>
                                <p className="text-xs opacity-80">Your financial data is never stored on our servers.</p>
                            </div>
                        </div>

                        <form onSubmit={handlePaymentSubmit} className="space-y-4">
                            <Input
                                label="Card Holder Name"
                                placeholder="e.g. John Doe"
                                fullWidth
                                required
                            />

                            <Input
                                label="Card Number"
                                placeholder="0000 0000 0000 0000"
                                leftIcon={CardIcon}
                                fullWidth
                                required
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Expiry Date"
                                    placeholder="MM/YY"
                                    fullWidth
                                    required
                                />
                                <Input
                                    label="CVC / CVV"
                                    placeholder="123"
                                    type="password"
                                    fullWidth
                                    required
                                    maxLength={3}
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setStep(1)}
                                    disabled={loading}
                                    className="order-2 sm:order-1 flex-1"
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    variant="success"
                                    isLoading={loading}
                                    leftIcon={Lock}
                                    className="order-1 sm:order-2 flex-1 px-8 shadow-lg shadow-success/20"
                                >
                                    Pay BDT {tuition.salary}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </Modal>
    );
};

export default PaymentModal;
