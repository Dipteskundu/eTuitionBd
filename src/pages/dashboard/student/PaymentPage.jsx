import React, { useEffect, useState } from 'react';
import useTitle from '../../../hooks/useTitle';
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import useToast from '../../../hooks/useToast';
import { ArrowLeft, CreditCard, ShieldCheck, Globe, CheckCircle, Sparkles, User, BookOpen, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentPage = () => {
    useTitle('Secure Payment');
    const { applicationId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { error: toastError } = useToast();

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [application, setApplication] = useState(null);
    const [tuition, setTuition] = useState(null);

    // Card State
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvc, setCardCvc] = useState('');

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
                navigate(`/dashboard/student/payment/success?session_id=${res.data.paymentId}`);
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
                <div className="w-full md:w-[40%] bg-indigo-900 p-8 md:p-12 text-white relative flex flex-col justify-between overflow-hidden">
                    {/* Decorative Patterns */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

                    <div className="relative z-10">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-indigo-200 hover:text-white transition-colors mb-8 group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Back</span>
                        </button>

                        <div className="mb-8">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-medium mb-4">
                                <Sparkles size={12} className="text-amber-300" />
                                Premium Education
                            </span>
                            <h2 className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-2">Order Summary</h2>
                            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1 leading-tight">
                                {tuition?.subject || "Tuition Fee"}
                            </h1>
                            <p className="text-indigo-300 text-lg">Standard Monthly Package</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                                <div className="p-2 bg-indigo-600 rounded-lg text-white shrink-0">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-indigo-300 font-bold">Selected Tutor</p>
                                    <p className="font-semibold text-sm">{application.tutorName || "Tutor Name"}</p>
                                    <p className="text-xs text-indigo-200/70">{application.tutorEmail}</p>
                                </div>
                            </div>

                            {tuition && (
                                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                                    <div className="p-2 bg-rose-500 rounded-lg text-white shrink-0">
                                        <BookOpen size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-indigo-300 font-bold">Details</p>
                                        <p className="font-semibold text-sm">{tuition.class} | {tuition.medium}</p>
                                        <p className="text-xs text-indigo-200/70">{tuition.daysPerWeek} days/week</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="relative z-10 pt-6 border-t border-indigo-500/30 space-y-3">
                        <div className="flex justify-between text-sm text-indigo-200">
                            <span>Subtotal</span>
                            <span>BDT {parseFloat(amount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-indigo-200">
                            <span>Service Fee (2%)</span>
                            <span>BDT {(parseFloat(amount) * 0.02).toFixed(2)}</span>
                        </div>
                        <div className="flex items-end justify-between pt-2">
                            <span className="text-indigo-100 font-medium">Total due</span>
                            <div className="text-right">
                                <p className="text-3xl font-bold tracking-tight text-white">BDT {(
                                    parseFloat(amount) + (parseFloat(amount) * 0.02)
                                ).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full md:w-[60%] bg-white/50 p-8 md:p-12 lg:p-16 relative">
                    <div className="max-w-md mx-auto">
                        <div className="mb-8">
                            {/* Visual Credit Card */}
                            <div className="w-full aspect-[1.586] bg-slate-900 rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden mb-8 transform transition-transform hover:scale-[1.02] duration-300">
                                {/* Card Background Texture */}
                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.2) 0%, transparent 50%)' }}></div>
                                <div className="absolute top-0 right-0 p-6 opacity-50">
                                    <Globe size={48} strokeWidth={1} />
                                </div>

                                <div className="flex flex-col justify-between h-full relative z-10">
                                    <div className="flex justify-between items-start">
                                        <ShieldCheck size={32} className="text-indigo-400" />
                                        <span className="font-mono text-xs opacity-50 tracking-widest">DEBIT</span>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="font-mono text-2xl tracking-widest drop-shadow-md">
                                            {cardNumber || "0000 0000 0000 0000"}
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <div>
                                                <div className="text-[10px] uppercase tracking-wider opacity-60 mb-1">Card Holder</div>
                                                <div className="font-medium tracking-wide uppercase truncate max-w-[180px]">
                                                    {cardName || "YOUR NAME"}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] uppercase tracking-wider opacity-60 mb-1">Expires</div>
                                                <div className="font-mono">{cardExpiry || "MM/YY"}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handlePayment} className="space-y-5">
                            <div className="grid gap-2">
                                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider ml-1">Card Number</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        maxLength={19}
                                        placeholder="0000 0000 0000 0000"
                                        className="w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-3 pl-12 font-mono text-slate-600 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
                                        value={cardNumber}
                                        onChange={(e) => {
                                            const v = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                                            setCardNumber(v);
                                        }}
                                        required
                                    />
                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider ml-1">Card Holder Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="JOHN DOE"
                                        className="w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-3 pl-12 font-medium text-slate-600 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300 uppercase"
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value)}
                                        required
                                    />
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label className="text-xs font-bold uppercase text-slate-400 tracking-wider ml-1">Expiry Date</label>
                                    <input
                                        type="text"
                                        maxLength={5}
                                        placeholder="MM/YY"
                                        className="w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-3 font-mono text-center text-slate-600 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
                                        value={cardExpiry}
                                        onChange={(e) => {
                                            let v = e.target.value.replace(/\D/g, '');
                                            if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
                                            setCardExpiry(v);
                                        }}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-xs font-bold uppercase text-slate-400 tracking-wider ml-1">CVC / CVV</label>
                                    <input
                                        type="text"
                                        maxLength={4}
                                        placeholder="123"
                                        className="w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-3 font-mono text-center text-slate-600 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
                                        value={cardCvc}
                                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
                                >
                                    {processing ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Processing...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <span>Pay Now</span>
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </motion.button>

                                <div className="mt-6 flex items-center justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-4 object-contain" alt="Visa" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6 object-contain" alt="Mastercard" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/American_Express_logo.svg/1200px-American_Express_logo.svg.png" className="h-4 object-contain" alt="Amex" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentPage;
