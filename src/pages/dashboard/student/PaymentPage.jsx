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
    const totalAmount = parseFloat(amount).toFixed(2);

    return (
        <div className="min-h-screen flex flex-col md:flex-row font-sans">
            {/* Left Side - Order Summary (Pinkish/Light Background) */}
            <div className="w-full md:w-[45%] lg:w-[40%] bg-[#fdf2f2] p-8 md:p-12 border-r border-base-200 flex flex-col text-[#30313d]">
                <div className="flex items-center gap-2 mb-8">
                    <button className="btn btn-sm btn-ghost p-0 hover:bg-transparent text-[#30313d]/50 hover:text-[#30313d]" onClick={() => navigate(-1)}>
                        <ArrowLeft size={16} />
                    </button>
                    <div className="bg-[#e4e4e7] px-2 py-1 rounded text-xs font-semibold flex items-center gap-1.5 text-[#30313d]">
                        <span className="w-2 h-2 rounded-full bg-base-content/50"></span>
                        New business sandbox
                    </div>
                    <div className="bg-[#2e2e31] text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#f6a723]"></span>
                        Sandbox
                    </div>
                </div>

                <div className="mt-8">
                    <p className="text-[#30313d]/70 text-sm mb-2">Please pay for: <span className="font-medium text-[#30313d]">{tuition?.subject || "Tuition Fee"}</span></p>
                    <div className="flex items-start">
                        <h1 className="text-4xl font-bold text-[#30313d] tracking-tight">
                            BDT-{totalAmount}
                        </h1>
                    </div>
                </div>


            </div>

            {/* Right Side - Payment Form */}
            <div className="w-full md:flex-1 bg-white p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full space-y-8">

                    {/* Express Checkout Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                        <button className="bg-[#00d66f] hover:bg-[#00c063] h-10 rounded text-white font-bold flex items-center justify-center gap-1 transition-colors">
                            Link
                        </button>
                        <button className="bg-[#ffb3c7] hover:bg-[#ff9eb8] h-10 rounded text-black font-bold flex items-center justify-center transition-colors">
                            Klarna
                        </button>
                        <button className="bg-[#fad676] hover:bg-[#f8cd5c] h-10 rounded text-black font-medium flex items-center justify-center transition-colors">
                            amazon pay
                        </button>
                    </div>

                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-medium">OR</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#30313d]">Email</label>
                            <Input
                                value={user?.email || 'honey@nuts.com'}
                                readOnly
                                className="bg-[#f0f2f5] border-transparent focus:bg-white focus:border-primary transition-all hover:bg-[#e4e6e9]"
                                fullWidth
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-[#30313d]">Payment method</label>

                            <div className="border border-[#e6e6e6] rounded-md overflow-hidden bg-white">
                                {/* Card Option (Active) */}
                                <div className="p-4 border-b border-[#e6e6e6] bg-[#fdfdfd] flex items-start gap-3">
                                    <div className="mt-1">
                                        <div className="w-4 h-4 rounded-full bg-primary border-[5px] border-white ring-1 ring-primary shadow-sm"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="font-semibold text-[#30313d] text-sm">Card</span>
                                            <div className="flex gap-1.5 opacity-70">
                                                <div className="w-8 h-5 bg-[#1a1f71] rounded flex items-center justify-center text-[8px] text-white font-bold">VISA</div>
                                                <div className="w-8 h-5 bg-[#ea001b] rounded flex items-center justify-center text-[8px] text-white font-bold">MC</div>
                                                <div className="w-8 h-5 bg-[#006fcf] rounded flex items-center justify-center text-[8px] text-white font-bold">AMEX</div>
                                            </div>
                                        </div>

                                        {/* Card Inputs */}
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-[#686975]">Card information</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="1234 1234 1234 1234"
                                                        className="w-full px-3 py-2.5 bg-white border border-[#e6e6e6] rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-gray-300 shadow-sm"
                                                        maxLength={19}
                                                        required
                                                    />
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                                                        <CreditCard size={16} className="text-gray-400" />
                                                    </div>
                                                </div>
                                                <div className="flex gap-3 pt-1">
                                                    <input
                                                        type="text"
                                                        placeholder="MM / YY"
                                                        className="w-1/2 px-3 py-2.5 bg-white border border-[#e6e6e6] rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-gray-300 shadow-sm"
                                                        maxLength={5}
                                                        required
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="CVC"
                                                        className="w-1/2 px-3 py-2.5 bg-white border border-[#e6e6e6] rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-gray-300 shadow-sm"
                                                        maxLength={3}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-[#686975]">Cardholder name</label>
                                                <input
                                                    type="text"
                                                    placeholder="Full name on card"
                                                    className="w-full px-3 py-2.5 bg-white border border-[#e6e6e6] rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-gray-300 shadow-sm"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-[#686975]">Country or region</label>
                                                <select className="w-full px-3 py-2.5 bg-white border border-[#e6e6e6] rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm appearance-none cursor-pointer">
                                                    <option>United States</option>
                                                    <option>Bangladesh</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 border-b border-[#e6e6e6] bg-[#fcfcfc] flex items-center gap-3 opacity-60 hover:opacity-100 cursor-pointer transition-opacity">
                                    <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                                    <span className="font-medium text-[#30313d] text-sm">Affirm</span>
                                </div>
                                <div className="p-3 border-b border-[#e6e6e6] bg-[#fcfcfc] flex items-center gap-3 opacity-60 hover:opacity-100 cursor-pointer transition-opacity">
                                    <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                                    <span className="font-medium text-[#30313d] text-sm flex items-center gap-2">
                                        <div className="w-4 h-4 bg-[#00d64f] rounded-sm text-white flex items-center justify-center text-[10px] font-bold"></div> Cash App Pay
                                    </span>
                                </div>
                                <div className="p-3 bg-[#fcfcfc] flex items-center gap-3 opacity-60 hover:opacity-100 cursor-pointer transition-opacity">
                                    <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                                    <span className="font-medium text-[#30313d] text-sm">Klarna</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 p-3 bg-[#f8f9fa] rounded text-xs text-[#686975] leading-relaxed">
                            <input type="checkbox" className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
                            <div>
                                <strong className="text-[#30313d] block mb-0.5">Save my information for faster checkout</strong>
                                Pay securely at New business sandbox and everywhere Link is accepted.
                            </div>
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            className="h-11 bg-[#0570de] hover:bg-[#0461c2] text-white font-semibold text-lg rounded shadow-sm border-none mt-2"
                            isLoading={processing}
                        >
                            Pay
                        </Button>

                        <div className="text-center text-[10px] text-[#686975] mt-4 space-y-1">
                            <p>By paying, you agree to Link's <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy</a>.</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
