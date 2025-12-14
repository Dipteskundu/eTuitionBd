import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Earnings = () => {
    const axiosSecure = useAxiosSecure();
    const [payments, setPayments] = useState([]);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                // Fetch stats for total and recent payments for history
                const res = await axiosSecure.get('/tutor/dashboard-stats');
                setTotalEarnings(res.data.totalEarnings);

                const activityRes = await axiosSecure.get('/tutor/recent-activities');
                setPayments(activityRes.data.recentPayments);
            } catch (error) {
                console.error("Failed to fetch earnings", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEarnings();
    }, [axiosSecure]);

    // Mock chart data - in production should come from aggregated backend data
    const chartData = [
        { name: 'Jan', amount: 4000 },
        { name: 'Feb', amount: 3000 },
        { name: 'Mar', amount: 2000 },
        { name: 'Apr', amount: 2780 },
        { name: 'May', amount: 1890 },
        { name: 'Jun', amount: 2390 },
        { name: 'Jul', amount: 3490 },
    ];

    if (loading) return <div className="flex justify-center p-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Earnings & Payments</h1>

            {/* Total Earnings Card */}
            <div className="card bg-primary text-primary-content shadow-xl max-w-sm">
                <div className="card-body">
                    <h2 className="card-title">Total Earnings</h2>
                    <div className="flex items-center gap-2 text-4xl font-bold">
                        <DollarSign size={36} /> {totalEarnings}
                        <span className="text-lg font-normal opacity-80">BDT</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart */}
                <div className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-200">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp size={18} className="text-primary" /> Monthly Overview
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Payments Table */}
                <div className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-200">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Calendar size={18} className="text-primary" /> Recent Payments
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="text-center text-gray-400 py-4">No payments received yet</td>
                                    </tr>
                                ) : (
                                    payments.map((pay) => (
                                        <tr key={pay._id}>
                                            <td>{new Date(pay.created_at).toLocaleDateString()}</td>
                                            <td className="font-medium">BDT {pay.amount}</td>
                                            <td>
                                                <span className="badge badge-success text-white badge-sm">Success</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Earnings;
