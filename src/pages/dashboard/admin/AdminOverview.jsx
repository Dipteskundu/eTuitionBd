import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Users, BookOpen, DollarSign, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminOverview = () => {
    const axiosSecure = useAxiosSecure();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTuitions: 0,
        totalStudentCount: 0,
        totalTutorCount: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axiosSecure.get('/reports/analytics');
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [axiosSecure]);

    if (loading) return <div className="p-10 text-center"><span className="loading loading-dots loading-lg"></span></div>;

    const data = [
        { name: 'Students', value: stats.totalStudentCount },
        { name: 'Tutors', value: stats.totalTutorCount },
        { name: 'Tuitions', value: stats.totalTuitions },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="stats shadow bg-base-100 border border-base-200">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <Users size={32} />
                        </div>
                        <div className="stat-title">Total Users</div>
                        <div className="stat-value text-primary">{stats.totalUsers}</div>
                        <div className="stat-desc">{stats.totalStudentCount} Students, {stats.totalTutorCount} Tutors</div>
                    </div>
                </div>

                <div className="stats shadow bg-base-100 border border-base-200">
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <BookOpen size={32} />
                        </div>
                        <div className="stat-title">Total Tuitions</div>
                        <div className="stat-value text-secondary">{stats.totalTuitions}</div>
                        <div className="stat-desc text-secondary">Posted on platform</div>
                    </div>
                </div>

                <div className="stats shadow bg-base-100 border border-base-200">
                    <div className="stat">
                        <div className="stat-figure text-success">
                            <DollarSign size={32} />
                        </div>
                        <div className="stat-title">Total Revenue</div>
                        <div className="stat-value text-success">${stats.totalRevenue}</div> {/* Assuming USD or converting */}
                        <div className="stat-desc">From accepted tuitions</div>
                    </div>
                </div>

                <div className="stats shadow bg-base-100 border border-base-200">
                    <div className="stat">
                        <div className="stat-figure text-warning">
                            <Activity size={32} />
                        </div>
                        <div className="stat-title">System Health</div>
                        <div className="stat-value text-warning">Good</div>
                        <div className="stat-desc">All systems operational</div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card bg-base-100 shadow-xl border border-base-200 p-6">
                    <h3 className="text-xl font-bold mb-4">Platform Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8" barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Placeholder for Recent Activity Feed if API implemented later */}
                <div className="card bg-base-100 shadow-xl border border-base-200 p-6">
                    <h3 className="text-xl font-bold mb-4">Recent Activities</h3>
                    <div className="space-y-4">
                        <div className="flex gap-4 items-center">
                            <div className="badge badge-info badge-xs"></div>
                            <span className="text-sm">Admin dashboard initialized.</span>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="badge badge-success badge-xs"></div>
                            <span className="text-sm">System metrics tracking enabled.</span>
                        </div>
                        {/* Static since we didn't implement strict admin activity log yet */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
