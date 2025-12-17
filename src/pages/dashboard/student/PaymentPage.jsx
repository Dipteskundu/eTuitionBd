import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import useToast from '../../../hooks/useToast';
import { ArrowLeft, CreditCard, Lock, ShieldCheck, ShoppingBag, Globe } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Spinner from '../../../components/ui/Spinner';
import Card from '../../../components/ui/Card';
import { motion } from 'framer-motion';

const PaymentPage = () => {
    const { applicationId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { showToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [application, setApplication] = useState(null);
    const [tuition, setTuition] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Application Details to get expected salary & tutor info
                // We might need a specific endpoint or filter from all apps. 
                // For now, let's assume we can fetch by ID or filter from list.
                // Since backend might not have single app endpoint, we'll fetch all and find.
                // ideally: const res = await axiosSecure.get(`/applications/${applicationId}`);

                // Fallback: Fetch all student applications and find
                const res = await axiosSecure.get(`/student-applications/${user.email}`);
                const foundApp = res.data.find(app => app._id === applicationId);

                if (!foundApp) {
                    showToast("Application not found", "error");
                    navigate('/dashboard/student/applications');
                    return;
                }
                setApplication(foundApp);

                // 2. Fetch Tuition Details for Subject Name etc.
                if (foundApp.tuitionId) {
                    const tuitionRes = await axiosSecure.get(`/tuitions/${foundApp.tuitionId}`);
                    setTuition(tuitionRes.data);
                }

            } catch (error) {
                console.error("Error fetching payment details:", error);
                showToast("Failed to load payment details", "error");
            } finally {
                setLoading(false);
            }
        };

        if (user?.email && applicationId) {
            fetchData();
        }
    }, [applicationId, user, axiosSecure, navigate, showToast]);

    const handlePayment = async (e) => {
        e.preventDefault();
        setProcessing(true);

        // Simulate Stripe/Gateway delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const payload = {
                applicationId: application._id,
                tuitionId: application.tuitionId,
                tutorEmail: application.tutorEmail,
                amount: application.expectedSalary || tuition?.salary || 0,
                method: "Card" // Could be dynamic
            };

            const res = await axiosSecure.post('/payments/demo', payload);

            if (res.data.success) {
                navigate('/dashboard/student/payment/success');
            } else {
                showToast("Payment failed", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Payment processing error", "error");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <Spinner fullScreen variant="dots" />;
    if (!application) return null;

    const amount = application.expectedSalary || tuition?.salary || 0;

    return (
        <div className="min-h-screen bg-base-100 flex flex-col md:flex-row">
            {/* Left Side - Order Summary (Light Background) */}
            <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-20 flex flex-col justify-center bg-base-200/30 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-50">
                    <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary-500/5 rounded-full blur-[80px]" />
                    <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-secondary-500/5 rounded-full blur-[80px]" />
                </div>

                <div className="relative z-10 max-w-md mx-auto w-full">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="mb-8 -ml-3 text-base-content/60 hover:text-primary-500"
                        onClick={() => navigate(-1)}
                        leftIcon={<ArrowLeft size={18} />}
                    >
                        Back
                    </Button>

                    <div className="mb-2 uppercase tracking-widest text-xs font-bold text-base-content/50">Pay for Tuition</div>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-base-content">
                        {tuition?.subject || "Tuition Fee"}
                    </h1>

                    <div className="flex items-baseline gap-2 mb-8">
                        <span className="text-5xl md:text-6xl font-bold text-primary-500">
                            ৳ {amount}
                        </span>
                        <span className="text-xl text-base-content/60">BDT</span>
                    </div>

                    <div className="space-y-4 mb-12">
                        <div className="flex items-center gap-3 text-base-content/80">
                            <ShoppingBag className="text-primary-500" size={20} />
                            <span>Tutor: <span className="font-semibold">{application.tutorName || application.tutorEmail}</span></span>
                        </div>
                        {tuition && (
                            <div className="flex items-center gap-3 text-base-content/80">
                                <Globe className="text-secondary-500" size={20} />
                                <span>Class: {tuition.class} | {tuition.medium}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-3 text-base-content/80">
                            <ShieldCheck className="text-success-500" size={20} />
                            <span>Secure SSL Payment</span>
                        </div>
                    </div>

                    <div className="p-4 bg-primary-500/5 rounded-lg border border-primary-500/10 text-sm text-base-content/70">
                        Powered by <strong>Stripe</strong> (Simulated). No real money will be charged.
                    </div>
                </div>
            </div>

            {/* Right Side - Payment Form (White/Card Background) */}
            <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-20 flex flex-col justify-center bg-base-100 shadow-2xl z-20">
                <div className="max-w-md mx-auto w-full">
                    <h2 className="text-2xl font-bold mb-8">Payment Details</h2>

                    <form onSubmit={handlePayment} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-base-content/70">Email</label>
                            <Input
                                value={user?.email || ''}
                                readOnly
                                className="bg-base-200/50 cursor-not-allowed border-none"
                                fullWidth
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-base-content/70">Card Information</label>
                            <div className="p-4 border border-base-300 rounded-xl focus-within:ring-2 focus-within:ring-primary-500 transition-all bg-base-100">
                                <div className="flex items-center gap-3 mb-3 border-b border-base-200 pb-3">
                                    <CreditCard className="text-base-content/40" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Card number"
                                        className="w-full bg-transparent outline-none font-mono text-base-content placeholder:text-base-content/30"
                                        required
                                        maxLength={19}
                                    />
                                    <div className="flex gap-1">
                                        <div className="w-8 h-5 bg-blue-600 rounded"></div>
                                        <div className="w-8 h-5 bg-red-500 rounded"></div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="MM / YY"
                                        className="w-1/2 bg-transparent outline-none font-mono text-base-content placeholder:text-base-content/30"
                                        required
                                        maxLength={5}
                                    />
                                    <div className="w-px bg-base-200"></div>
                                    <input
                                        type="text"
                                        placeholder="CVC"
                                        className="w-1/2 bg-transparent outline-none font-mono text-base-content placeholder:text-base-content/30"
                                        required
                                        maxLength={3}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-base-content/70">Cardholder Name</label>
                            <Input
                                placeholder="Full name on card"
                                fullWidth
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-base-content/70">Country or region</label>
                            <select className="select select-bordered w-full bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-xl">
                                <option>Bangladesh</option>
                                <option>United States</option>
                                <option>Canada</option>
                                <option>United Kingdom</option>
                            </select>
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            variant="gradient"
                            className="mt-8 h-12 text-lg shadow-xl shadow-primary-500/20"
                            isLoading={processing}
                            leftIcon={Lock}
                        >
                            Pay BDT {amount}
                        </Button>

                        <div className="flex items-center justify-center gap-2 text-xs text-base-content/50 mt-4">
                            <Lock size={12} />
                            Payments are secure and encrypted
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
