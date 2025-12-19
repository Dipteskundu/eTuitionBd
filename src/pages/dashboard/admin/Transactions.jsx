import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useToast from '../../../hooks/useToast';

const Transactions = () => {
    const axiosSecure = useAxiosSecure();
    const toast = useToast();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await axiosSecure.get('/all-payments');
                setTransactions(res.data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch transactions');
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [axiosSecure]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-gray-500">No transactions found</h3>
                <p className="text-sm text-gray-400">Transactions will appear here once payments are made.</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">All Transactions</h2>
            <div className="overflow-x-auto bg-base-100 rounded-xl shadow-sm border border-base-200">
                <table className="table w-full">
                    <thead className="bg-base-200">
                        <tr>
                            <th>Transaction ID</th>
                            <th>Student</th>
                            <th>Tutor</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((txn) => (
                            <tr key={txn._id} className="hover">
                                <td className="font-mono text-xs">{txn.transactionId || 'N/A'}</td>
                                <td>{txn.studentEmail}</td>
                                <td>{txn.tutorEmail}</td>
                                <td className="font-bold text-success">৳{txn.amount}</td>
                                <td className="text-sm text-gray-500">
                                    {new Date(txn.date || txn.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </td>
                                <td>
                                    <span className={`badge ${txn.status === 'paid' ? 'badge-success' : 'badge-warning'} text-white`}>
                                        {txn.status?.toUpperCase() || 'PAID'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transactions;
