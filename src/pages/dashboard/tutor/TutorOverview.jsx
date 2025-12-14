import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { motion } from 'framer-motion';
import { Users, DollarSign, Briefcase, Star, Clock, CheckCircle } from 'lucide-react';
import Card from '../../../components/ui/Card';
import useAuth from '../../../hooks/useAuth';

const TutorOverview = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [stats, setStats] = useState({
        totalEarnings: 0,
        activeTuitionsCount: 0,
        totalApplications: 0,
        profileViews: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const statsRes = await axiosSecure.get('/tutor/dashboard-stats');
                setStats(statsRes.data);

                const activityRes = await axiosSecure.get('/tutor/recent-activities');
                const apps = activityRes.data.recentApps.map(app => ({
                    id: app._id,
                    type: 'Application',
                    title: `Applied for Tuition ID: ${app.tuitionId.substring(0, 8)}...`, // Better to fetch tuition title if possible, but ID for now
                    time: new Date(app.created_at).toLocaleDateString(),
                    status: app.status
                }));
                const payments = activityRes.data.recentPayments.map(pay => ({
                    id: pay._id,
                    type: 'Payment Received',
                    title: `Received BDT ${pay.amount}`,
                    time: new Date(pay.created_at).toLocaleDateString(),
                    status: 'success'
                }));

                // Merge and sort
                const combined = [...apps, ...payments].sort((a, b) => new Date(b.time) - new Date(a.time));
                setRecentActivities(combined);

            } catch (error) {
                console.error("Failed to fetch tutor stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [axiosSecure]);

    const statCards = [
        { title: 'Total Earnings', value: `BDT ${stats.totalEarnings}`, icon: <DollarSign className="text-white" size={24} />, color: 'bg-primary' },
        { title: 'Active Tuitions', value: stats.activeTuitionsCount, icon: <Briefcase className="text-white" size={24} />, color: 'bg-secondary' },
        { title: 'Total Applications', value: stats.totalApplications, icon: <Briefcase className="text-white" size={24} />, color: 'bg-accent' },
        { title: 'Profile Views', value: stats.profileViews || 'N/A', icon: <Users className="text-white" size={24} />, color: 'bg-warning' },
    ];

    if (loading) return <div className="flex justify-center p-10"><span className="loading loading-spinner text-primary"></span></div>;

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Welcome Back, {user?.displayName?.split(' ')[0] || 'Tutor'}! 👨‍🏫</h1>
                    <p className="text-gray-500 dark:text-gray-400">Track your earnings and job applications here.</p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-base-200 px-4 py-2 rounded-lg shadow-sm border border-base-200 dark:border-base-300">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="stats shadow w-full bg-base-100 border border-base-200 dark:border-base-300">
                            <div className="stat">
                                <div className={`stat-figure ${stat.color} p-3 rounded-xl shadow-lg`}>
                                    {stat.icon}
                                </div>
                                <div className="stat-title text-gray-500 dark:text-gray-400 font-medium">{stat.title}</div>
                                <div className="stat-value text-2xl mt-1 dark:text-gray-200">{stat.value}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <Card title="Recent Activity" className="h-full">
                        <div className="space-y-4 mt-2">
                            {recentActivities.length === 0 && <p className="text-gray-500 text-center py-4">No recent activity.</p>}
                            {recentActivities.map((activity, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 hover:bg-base-200 rounded-lg transition-colors border-b border-base-100 dark:border-gray-700 last:border-0">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activity.status === 'success' ? 'bg-green-100 text-green-600' :
                                        activity.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                            'bg-blue-100 text-blue-600'
                                        }`}>
                                        {activity.status === 'success' ? <CheckCircle size={20} /> :
                                            activity.status === 'pending' ? <Clock size={20} /> :
                                                <Star size={20} />}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200">{activity.type}</h4>
                                        <p className="text-xs text-gray-500">{activity.title}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Profile Card */}
                <div>
                    {/* Reusing existing card logic but with dynamic user data if needed for stats or quick links */}
                    <Card className="h-full bg-gradient-to-br from-secondary to-purple-600 text-white border-none">
                        <div className="flex flex-col items-center text-center h-full justify-center space-y-4 py-6">
                            <div className="avatar">
                                <div className="w-20 rounded-full ring ring-white ring-offset-2 ring-offset-secondary">
                                    <img src={user?.photoURL || "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=100&q=80"} alt="Profile" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{user?.displayName || "Tutor"}</h3>
                                <p className="text-purple-100 text-sm">{user?.email}</p>
                            </div>
                            <div className="w-full pt-4">
                                <a href="/dashboard/tutor/profile" className="btn btn-white w-full text-secondary hover:bg-gray-100 border-none">Update Profile</a>
                                <a href="/dashboard/tutor/available-tuitions" className="btn btn-outline text-white hover:bg-white/20 w-full mt-3 border-white/50">Find Tuitions</a>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TutorOverview;
