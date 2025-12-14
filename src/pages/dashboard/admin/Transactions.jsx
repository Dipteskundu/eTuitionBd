import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useToast from '../../../hooks/useToast';

const Transactions = () => {
    const axiosSecure = useAxiosSecure();
    const { showToast } = useToast();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await axiosSecure.get('/all-payments');
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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Transaction History</h1>

            <div className="overflow-x-auto bg-base-100 rounded-xl shadow-sm border border-base-200">
                <table className="table w-full">
                    <thead>
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
                            <tr key={txn._id}>
                                <td className="font-mono text-xs">{txn.transactionId}</td>
                                <td>{txn.studentEmail}</td>
                                <td>{txn.tutorEmail}</td>
                                <td className="font-bold text-success">${txn.amount}</td>
                                <td className="text-sm text-gray-500">
                                    {new Date(txn.created_at).toLocaleDateString()}
                                </td>
                                <td>
                                    <span className="badge badge-success text-white">PAID</span>
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
