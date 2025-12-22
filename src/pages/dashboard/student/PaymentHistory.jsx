import React, { useEffect, useState } from 'react';
import useTitle from '../../../hooks/useTitle';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { CreditCard, Calendar, CheckCircle, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Spinner from '../../../components/ui/Spinner';
import { motion } from 'framer-motion';

const PaymentHistory = () => {
    useTitle('Payment History');
    const axiosSecure = useAxiosSecure();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await axiosSecure.get('/my-payments');
                setPayments(res.data);
            } catch (error) {
                console.error("Error fetching payments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [axiosSecure]);

    if (loading) return <Spinner fullScreen variant="dots" />;

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-center gap-4"
            >
                <div>
                    <h1 className="text-3xl font-heading font-bold gradient-text">Payment History</h1>
                    <p className="text-base-content/70">Track your tuition payment transactions.</p>
                </div>
                <div className="stats shadow-lg bg-base-100/50 backdrop-blur-md border border-base-200">
                    <div className="stat py-2 px-4">
                        <div className="stat-figure text-primary">
                            <DollarSign size={24} />
                        </div>
                        <div className="stat-title text-xs uppercase font-bold tracking-wider">Total Spent</div>
                        <div className="stat-value text-primary text-2xl">
                            ৳ {payments.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0)}
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
            >
                <Card glass className="p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="bg-base-200/50 text-base-content">
                                    <th className="py-4 px-6 text-sm font-bold uppercase tracking-wider">Transaction Info</th>
                                    <th className="py-4 px-6 text-sm font-bold uppercase tracking-wider">Tuition & User</th>
                                    <th className="py-4 px-6 text-sm font-bold uppercase tracking-wider">Amount</th>
                                    <th className="py-4 px-6 text-sm font-bold uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-6 text-sm font-bold uppercase tracking-wider text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center opacity-50">
                                                <CreditCard size={48} className="mb-4 text-base-content/30" />
                                                <p className="text-lg font-medium">No payment records found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    payments.map((payment, index) => (
                                        <motion.tr
                                            key={payment._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + (index * 0.05) }}
                                            className="hover:bg-base-100/50 transition-colors border-b border-base-200/50 last:border-0"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-base-200 rounded-lg text-base-content/70">
                                                        <CreditCard size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="font-mono text-xs opacity-50 mb-0.5">TRX ID</div>
                                                        <div className="font-mono text-xs font-bold bg-base-200/50 px-1.5 py-0.5 rounded select-all">
                                                            {payment.transactionId}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-base-content">{payment.tuitionTitle || 'General Tuition'}</div>
                                                <div className="text-xs opacity-70 flex items-center gap-1 mt-0.5">
                                                    For: {payment.otherName || payment.tutorEmail || payment.studentEmail}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-primary text-lg">
                                                ৳ {payment.amount}
                                                <div className="text-xs font-normal opacity-60 uppercase">{payment.method || 'Card'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`badge border-0 font-bold py-3 px-3 gap-1 ${payment.status === 'paid' ? 'bg-success/10 text-success' :
                                                    payment.status === 'pending' ? 'bg-warning/10 text-warning' :
                                                        'bg-error/10 text-error'
                                                    }`}>
                                                    {payment.status === 'paid' ? <CheckCircle size={14} /> :
                                                        payment.status === 'pending' ? <Clock size={14} /> :
                                                            <AlertTriangle size={14} />}
                                                    {payment.status === 'paid' ? 'SUCCESS' : payment.status.toUpperCase()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-70">
                                                    <Calendar size={14} />
                                                    <span className="text-sm font-medium">
                                                        {new Date(payment.date || payment.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default PaymentHistory;
