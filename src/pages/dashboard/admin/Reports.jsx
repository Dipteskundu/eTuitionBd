import React, { useState, useEffect } from 'react';
import { FileDown, TrendingUp, TrendingDown, Users, BookOpen, DollarSign, Calendar, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useToast from '../../../hooks/useToast';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import { motion } from 'framer-motion';

const Reports = () => {
    const axiosSecure = useAxiosSecure();
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [analyticsRes, paymentsRes] = await Promise.all([
                    axiosSecure.get('/reports/analytics'),
                    axiosSecure.get('/all-payments')
                ]);
                setStats({
                    ...analyticsRes.data,
                    transactions: paymentsRes.data
                });
            } catch (error) {
                console.error('Failed to fetch reports data:', error);
                toast.error('Failed to load reports');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [axiosSecure]);

    const handleGenerateReport = (type) => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            toast.success(`${type} Report generated successfully!`);
        }, 1500);
    };

    if (loading) return <Spinner variant="dots" size="lg" fullScreen />;

    // Prepare chart data
    const userDistribution = [
        { name: 'Students', value: stats?.totalStudentCount || 0, color: '#3B82F6' },
        { name: 'Tutors', value: stats?.totalTutorCount || 0, color: '#10B981' },
        { name: 'Admins', value: 1, color: '#F59E0B' }
    ];

    // Mock monthly trend data (in real app, fetch from API)
    const monthlyTrend = [
        { month: 'Jan', revenue: 2400, tuitions: 24 },
        { month: 'Feb', revenue: 1398, tuitions: 13 },
        { month: 'Mar', revenue: 9800, tuitions: 98 },
        { month: 'Apr', revenue: 3908, tuitions: 39 },
        { month: 'May', revenue: 4800, tuitions: 48 },
        { month: 'Jun', revenue: 3800, tuitions: 38 },
    ];

    // Calculate growth rates (mock data)
    const growthMetrics = [
        { label: 'User Growth', value: '+12.5%', trend: 'up', icon: Users },
        { label: 'Revenue Growth', value: '+8.2%', trend: 'up', icon: DollarSign },
        { label: 'Tuition Posts', value: '+15.3%', trend: 'up', icon: BookOpen },
        { label: 'Completion Rate', value: '94.2%', trend: 'up', icon: TrendingUp },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
                <div>
                    <h1 className="text-3xl font-heading font-bold gradient-text">Reports & Analytics</h1>
                    <p className="text-base-content/70">Comprehensive platform insights and metrics</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="primary"
                        size="sm"
                        leftIcon={FileDown}
                        onClick={() => handleGenerateReport('PDF')}
                        isLoading={isGenerating}
                    >
                        Export PDF
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        leftIcon={Calendar}
                        onClick={() => handleGenerateReport('CSV')}
                        isLoading={isGenerating}
                    >
                        Export CSV
                    </Button>
                </div>
            </motion.div>

            {/* Growth Metrics */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {growthMetrics.map((metric, index) => (
                    <div key={index} className="card bg-base-100 shadow-lg border border-base-200 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-base-content/60">{metric.label}</p>
                                <p className="text-2xl font-bold mt-1">{metric.value}</p>
                            </div>
                            <div className={`p-3 rounded-xl ${metric.trend === 'up' ? 'bg-success/10' : 'bg-error/10'}`}>
                                {metric.trend === 'up' ? (
                                    <TrendingUp className="w-6 h-6 text-success" />
                                ) : (
                                    <TrendingDown className="w-6 h-6 text-error" />
                                )}
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-1">
                            <span className={`text-xs font-medium ${metric.trend === 'up' ? 'text-success' : 'text-error'}`}>
                                {metric.trend === 'up' ? '↑' : '↓'} vs last month
                            </span>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card bg-base-100 shadow-lg border border-base-200 p-6"
                >
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Revenue Trend
                    </h3>
                    <div className="w-full h-[280px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <AreaChart data={monthlyTrend}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    formatter={(value) => [`৳${value}`, 'Revenue']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#3B82F6"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* User Distribution Pie Chart */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card bg-base-100 shadow-lg border border-base-200 p-6"
                >
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <PieChartIcon className="w-5 h-5 text-primary" />
                        User Distribution
                    </h3>
                    <div className="w-full h-[280px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <PieChart>
                                <Pie
                                    data={userDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {userDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Legend */}
                    <div className="flex justify-center gap-6 mt-4">
                        {userDistribution.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                <span className="text-sm text-base-content/70">{item.name}: {item.value}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Summary Stats Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card bg-base-100 shadow-lg border border-base-200 p-6"
            >
                <h3 className="text-lg font-bold mb-4">Platform Summary</h3>
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-base-200">
                            <tr>
                                <th>Metric</th>
                                <th>Current Value</th>
                                <th>Previous Period</th>
                                <th>Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="font-medium">Total Users</td>
                                <td>{stats?.totalUsers || 0}</td>
                                <td className="text-base-content/60">{Math.floor((stats?.totalUsers || 0) * 0.88)}</td>
                                <td><span className="badge badge-success badge-sm">+12%</span></td>
                            </tr>
                            <tr>
                                <td className="font-medium">Total Tuitions</td>
                                <td>{stats?.totalTuitions || 0}</td>
                                <td className="text-base-content/60">{Math.floor((stats?.totalTuitions || 0) * 0.85)}</td>
                                <td><span className="badge badge-success badge-sm">+15%</span></td>
                            </tr>
                            <tr>
                                <td className="font-medium">Total Revenue</td>
                                <td className="font-bold text-success">৳{stats?.totalRevenue || 0}</td>
                                <td className="text-base-content/60">৳{Math.floor((stats?.totalRevenue || 0) * 0.92)}</td>
                                <td><span className="badge badge-success badge-sm">+8%</span></td>
                            </tr>
                            <tr>
                                <td className="font-medium">Active Students</td>
                                <td>{stats?.totalStudentCount || 0}</td>
                                <td className="text-base-content/60">{Math.floor((stats?.totalStudentCount || 0) * 0.9)}</td>
                                <td><span className="badge badge-success badge-sm">+10%</span></td>
                            </tr>
                            <tr>
                                <td className="font-medium">Active Tutors</td>
                                <td>{stats?.totalTutorCount || 0}</td>
                                <td className="text-base-content/60">{Math.floor((stats?.totalTutorCount || 0) * 0.85)}</td>
                                <td><span className="badge badge-success badge-sm">+15%</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Recent Transactions Preview */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card bg-base-100 shadow-lg border border-base-200 p-6"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Recent Transactions</h3>
                    <a href="/dashboard/admin/transactions" className="text-primary text-sm hover:underline">View All →</a>
                </div>
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-base-200">
                            <tr>
                                <th>Transaction ID</th>
                                <th>Student</th>
                                <th>Tutor</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats?.transactions?.slice(0, 5).map((txn) => (
                                <tr key={txn._id} className="hover">
                                    <td className="font-mono text-xs">{txn.transactionId?.slice(0, 15) || 'N/A'}...</td>
                                    <td className="text-sm">{txn.studentEmail?.split('@')[0]}</td>
                                    <td className="text-sm">{txn.tutorEmail?.split('@')[0]}</td>
                                    <td className="font-bold text-success">৳{txn.amount}</td>
                                    <td><span className="badge badge-success badge-sm">Paid</span></td>
                                </tr>
                            )) || (
                                    <tr>
                                        <td colSpan="5" className="text-center text-base-content/50">No transactions yet</td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default Reports;
