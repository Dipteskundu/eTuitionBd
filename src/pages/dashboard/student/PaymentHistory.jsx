import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { CreditCard, Calendar, CheckCircle } from 'lucide-react';

const PaymentHistory = () => {
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

    if (loading) return <div className="flex justify-center p-8"><span className="loading loading-spinner text-primary"></span></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Payment History</h1>

            <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Transaction ID</th>
                                <th>Tutor/Student</th>
                                <th>Tuition</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-500">
                                        No payment records found.
                                    </td>
                                </tr>
                            ) : (
                                payments.map((payment) => (
                                    <tr key={payment._id}>
                                        <td>
                                            <div className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                {payment.transactionId}
                                            </div>
                                        </td>
                                        <td className="font-bold">
                                            {payment.otherName || payment.tutorEmail || payment.studentEmail}
                                        </td>
                                        <td>
                                            <div className="text-sm font-medium">{payment.tuitionTitle || 'General Tuition'}</div>
                                        </td>
                                        <td className="font-bold text-success">BDT {payment.amount}</td>
                                        <td>
                                            <div className="badge badge-ghost badge-sm">{payment.method || 'N/A'}</div>
                                        </td>
                                        <td>
                                            <div className={`badge ${payment.status === 'paid' ? 'badge-success text-white' : 'badge-warning'}`}>
                                                {payment.status === 'paid' ? 'Success' : payment.status}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-gray-400" />
                                                {new Date(payment.date || payment.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentHistory;
