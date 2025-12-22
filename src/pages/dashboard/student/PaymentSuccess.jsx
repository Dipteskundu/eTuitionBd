import React, { useEffect, useState } from 'react';
import useTitle from '../../../hooks/useTitle';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { CheckCircle, AlertCircle, Home, FileText, ArrowRight } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import Card from '../../../components/ui/Card';
import { motion } from 'framer-motion';

const PaymentSuccess = () => {
    useTitle('Payment Success');
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [status, setStatus] = useState('verifying'); // verifying, success, error

    useEffect(() => {
        const verifyPayment = async () => {
            if (!sessionId) {
                setStatus('error');
                return;
            }
            try {
                const res = await axiosSecure.post('/payment-success', { sessionId });
                if (res.data.success) {
                    setStatus('success');
                } else {
                    setStatus('error');
                }
            } catch (error) {
                console.error("Payment verification failed:", error);
                setStatus('error');
            }
        };

        if (status === 'verifying') {
            verifyPayment();
        }
    }, [sessionId, axiosSecure, status]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
            <Card glass className="max-w-xl w-full text-center p-12 border-t-8 border-t-transparent data-[status=success]:border-t-success data-[status=error]:border-t-error" data-status={status}>

                {status === 'verifying' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <Spinner variant="dots" size="lg" />
                        <div>
                            <h2 className="text-2xl font-bold font-heading mb-2">Verifying Payment...</h2>
                            <p className="text-base-content/60">Please wait while we securely confirm your transaction.</p>
                        </div>
                    </motion.div>
                )}

                {status === 'success' && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mb-2 ring-8 ring-success/5"
                        >
                            <CheckCircle size={64} strokeWidth={3} />
                        </motion.div>

                        <div>
                            <h2 className="text-4xl font-bold font-heading gradient-text mb-4">Payment Successful!</h2>
                            <p className="text-base-content/70 text-lg max-w-md mx-auto leading-relaxed">
                                Thank you! Your payment has been processed successfully. The tutor has been approved for your tuition.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center">
                            <Button
                                variant="outline"
                                leftIcon={Home}
                                onClick={() => navigate('/dashboard/student')}
                            >
                                Dashboard
                            </Button>
                            <Button
                                variant="primary"
                                rightIcon={ArrowRight}
                                onClick={() => navigate('/dashboard/student/my-tuitions')}
                            >
                                View My Tuitions
                            </Button>
                        </div>
                    </motion.div>
                )}

                {status === 'error' && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <div className="w-24 h-24 bg-error/10 text-error rounded-full flex items-center justify-center mb-2 ring-8 ring-error/5">
                            <AlertCircle size={64} strokeWidth={3} />
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold font-heading text-error mb-4">Verification Failed</h2>
                            <p className="text-base-content/70 text-lg max-w-md mx-auto">
                                We couldn't verify your payment. If you were charged, please contact support immediately with your Transaction ID.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center">
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/contact')}
                            >
                                Contact Support
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate('/dashboard/student/applications')}
                            >
                                Back to Applications
                            </Button>
                        </div>
                    </motion.div>
                )}
            </Card>
        </div>
    );
};

export default PaymentSuccess;
