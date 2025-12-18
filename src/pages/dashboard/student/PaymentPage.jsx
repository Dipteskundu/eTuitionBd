import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import useToast from '../../../hooks/useToast';
import { ArrowLeft, CreditCard, ShieldCheck, Globe, CheckCircle, Sparkles, User, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentPage = () => {
    const { applicationId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { error: toastError } = useToast();

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [application, setApplication] = useState(null);
    const [tuition, setTuition] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosSecure.get(`/student-applications/${user.email}`);
                const foundApp = res.data.find(app => app._id === applicationId);

                if (!foundApp) {
                    toastError("Application not found");
                    navigate('/dashboard/student/applications');
                    return;
                }
                setApplication(foundApp);

                if (foundApp.tuitionId) {
                    try {
                        const tuitionRes = await axiosSecure.get(`/tuitions/${foundApp.tuitionId}`);
                        setTuition(tuitionRes.data);
                    } catch (err) {
                        console.warn("Tuition details could not be loaded", err);
                    }
                }

            } catch (error) {
                console.error("Error fetching payment details:", error);
                toastError("Failed to load payment details");
            } finally {
                setLoading(false);
            }
        };

        if (user?.email && applicationId) {
            fetchData();
        }
    }, [applicationId, user, axiosSecure, navigate, toastError]);

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
                method: "Card"
            };

            const res = await axiosSecure.post('/payments/demo', payload);

            if (res.data.success) {
                navigate('/dashboard/student/payment/success');
            } else {
                toastError("Payment failed");
            }
        } catch (error) {
            console.error(error);
            toastError("Payment processing error");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full"
                />
            </div>
        );
    }

    if (!application) return null;

    const amount = application.expectedSalary || tuition?.salary || 0;
    const totalAmount = parseFloat(amount).toFixed(2);

    return (
        <div className="min-h-screen bg-[#F0F4F8] font-sans text-slate-900 relative overflow-hidden flex items-center justify-center p-4">

            {/* Ambient Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-indigo-200/40 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] bg-rose-200/40 rounded-full blur-[100px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl w-full bg-white/70 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/50 overflow-hidden flex flex-col md:flex-row z-10"
            >
                {/* Left Side: Summary Panel */}
                <div className="w-full md:w-[40%] bg-gradient-to-br from-indigo-900 to-indigo-950 p-8 md:p-12 text-white relative flex flex-col justify-between">

                    {/* Decorative Patterns */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-indigo-200 hover:text-white transition-colors mb-10 group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Back</span>
                        </button>

                        <div className="mb-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-medium mb-6">
                                <Sparkles size={12} className="text-amber-300" />
                                Premium Education
                            </span>
                            <h2 className="text-indigo-200 text-sm font-medium uppercase tracking-wider mb-2">Payment For</h2>
                            <h1 className="text-3xl font-bold text-white mb-6 leading-tight">
                                {tuition?.subject || "Tuition Fee"} <br />
                                <span className="text-indigo-300 font-normal text-xl">Standard Package</span>
                            </h1>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 border border-white/5 backdrop-blur-md">
                                <div className="p-3 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-900/20">
                                    <User size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-indigo-300">Tutor</p>
                                    <p className="font-semibold">{application.tutorName || "Selected Tutor"}</p>
                                </div>
                            </div>

                            {tuition && (
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 border border-white/5 backdrop-blur-md">
                                    <div className="p-3 bg-rose-500 rounded-lg text-white shadow-lg shadow-rose-900/20">
                                        <BookOpen size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-indigo-300">Class & Medium</p>
                                        <p className="font-semibold">{tuition.class} | {tuition.medium}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-indigo-800/50">
                        <div className="flex items-end justify-between">
                            <span className="text-indigo-300 text-lg">Total</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl text-indigo-300">BDT</span>
                                <span className="text-5xl font-bold tracking-tighter">{totalAmount}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full md:w-[60%] p-8 md:p-12 lg:p-16 bg-white/50">
                    <div className="max-w-md mx-auto">
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Payment Details</h3>
                        <p className="text-slate-500 text-sm mb-8">Complete your purchase safely and securely.</p>

                        <form onSubmit={handlePayment} className="space-y-6">

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Email Address</label>
                                <div className="relative group">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        readOnly
                                        className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500">
                                        <CheckCircle size={18} />
                                    </div>
                                </div>
                            </div>

                            {/* Card Details */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Card Information</label>
                                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 shadow-sm">
                                    <div className="relative border-b border-slate-100">
                                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Card number"
                                            maxLength={19}
                                            required
                                            className="w-full py-3.5 pl-11 pr-4 outline-none text-slate-800 placeholder:text-slate-400 font-medium"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                                            {/* Placeholder Card Icons */}
                                            <div className="w-8 h-5 bg-slate-100 rounded border border-slate-200" />
                                            <div className="w-8 h-5 bg-slate-100 rounded border border-slate-200" />
                                        </div>
                                    </div>
                                    <div className="flex divide-x divide-slate-100">
                                        <input
                                            type="text"
                                            placeholder="MM / YY"
                                            maxLength={5}
                                            required
                                            className="w-1/2 py-3.5 px-4 outline-none text-slate-800 placeholder:text-slate-400 text-center font-medium"
                                        />
                                        <input
                                            type="text"
                                            placeholder="CVC"
                                            maxLength={3}
                                            required
                                            className="w-1/2 py-3.5 px-4 outline-none text-slate-800 placeholder:text-slate-400 text-center font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Name on Card */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Cardholder Name</label>
                                <input
                                    type="text"
                                    placeholder="Full name on card"
                                    required
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium uppercase"
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)" }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={processing}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 relative overflow-hidden"
                            >
                                {processing ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                    />
                                ) : (
                                    <>
                                        <span>Pay BDT {totalAmount}</span>
                                        <ShieldCheck size={18} className="text-indigo-200" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-xs text-center">
                            <ShieldCheck size={14} />
                            <p>Payments are secure and encrypted</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentPage;
