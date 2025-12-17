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

    /*
    const filteredTransactions = transactions.filter(txn =>
        txn.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.tutorEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    */

    if (loading) return <span className="loading loading-dots loading-lg"></span>;

    return (
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
    );
};

export default Transactions;
