import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useToast from '../../../hooks/useToast';
import useAuth from '../../../hooks/useAuth';

const MyTransactions = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await axiosSecure.get('/my-payments');
                setTransactions(res.data);
            } catch (error) {
                console.error(error);
                showToast('Failed to fetch transactions', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [axiosSecure]);

    if (loading) return <div className="p-10 text-center"><span className="loading loading-dots loading-lg text-primary"></span></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Payment History</h1>

            <div className="overflow-x-auto bg-base-100 rounded-xl shadow-sm border border-base-200">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Role</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-gray-500">No transactions found.</td>
                            </tr>
                        ) : (
                            transactions.map((txn) => (
                                <tr key={txn._id}>
                                    <td className="font-mono text-xs">{txn.transactionId || txn._id}</td>
                                    <td>
                                        {/* Show counterpart */}
                                        {user?.email === txn.studentEmail ? (
                                            <span className="text-xs">Paid To: {txn.tutorEmail}</span>
                                        ) : (
                                            <span className="text-xs">Received From: {txn.studentEmail}</span>
                                        )}
                                    </td>
                                    <td className={`font-bold ${user?.email === txn.studentEmail ? 'text-error' : 'text-success'}`}>
                                        {user?.email === txn.studentEmail ? '-' : '+'} BDT {txn.amount}
                                    </td>
                                    <td className="text-sm text-gray-500">
                                        {new Date(txn.date || txn.created_at).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <span className="badge badge-success text-white">PAID</span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyTransactions;
