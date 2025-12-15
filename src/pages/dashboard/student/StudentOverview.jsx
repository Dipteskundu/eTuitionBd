import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { LayoutDashboard, FileText, CheckCircle, DollarSign, Activity, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentOverview = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [stats, setStats] = useState({
        totalTuitions: 0,
        activeTuitions: 0,
        completedTuitions: 0,
        totalSpent: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [roleRequests, setRoleRequests] = useState([]); // New State
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const statsRes = await axiosSecure.get('/student/dashboard-stats');
                setStats(statsRes.data);

                const activityRes = await axiosSecure.get('/student/recent-activities');
                setRecentActivity(activityRes.data);

                // Fetch Role Requests
                const roleRes = await axiosSecure.get('/role-requests/my');
                setRoleRequests(roleRes.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [axiosSecure]);

    if (loading) {
        return <div className="flex justify-center items-center h-full"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    }

    const statCards = [
        { title: 'Total Posted', value: stats.totalTuitions, icon: FileText, color: 'bg-blue-100 text-blue-600' },
        { title: 'Active Tuitions', value: stats.activeTuitions, icon: Activity, color: 'bg-green-100 text-green-600' },
        { title: 'Completed', value: stats.completedTuitions, icon: CheckCircle, color: 'bg-purple-100 text-purple-600' },
        { title: 'Total Spent', value: `$${stats.totalSpent}`, icon: DollarSign, color: 'bg-yellow-100 text-yellow-600' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome back, {user?.displayName}!</h1>
                    <p className="text-gray-500 text-sm">Here's what's happening with your tuitions.</p>
                </div>
                <div className="badge badge-primary badge-outline gap-2 p-3">
                    <Clock size={14} />
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow"
                    >
                        <div className="card-body p-6 flex flex-row items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-full ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Role Request Status Section */}
            <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body">
                    <h2 className="card-title text-lg mb-4">Tutor Role Requests</h2>
                    {roleRequests.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>Requested Role</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Comments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roleRequests.map((req) => (
                                        <tr key={req._id}>
                                            <td className="capitalize">{req.requestedRole}</td>
                                            <td>{new Date(req.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`badge ${req.status === 'approved' ? 'badge-success text-white' :
                                                    req.status === 'rejected' ? 'badge-error text-white' :
                                                        'badge-warning text-white'
                                                    }`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="text-sm text-gray-500">
                                                {req.status === 'approved' ? 'Please refresh to access Tutor Dashboard' :
                                                    req.status === 'rejected' ? 'Contact Admin for meaningful feedback' :
                                                        'Under Review'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-gray-500 mb-2">You haven't requested to become a tutor yet.</p>
                            <div className="text-sm text-purple-600">Apply for a tuition to start the process!</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card bg-base-100 shadow-sm border border-base-200">
                    <div className="card-body">
                        <h2 className="card-title text-lg mb-4">Recent Tuition Posts</h2>
                        {recentActivity.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full">
                                    <thead>
                                        <tr>
                                            <th>Subject</th>
                                            <th>Location</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentActivity.map((activity) => (
                                            <tr key={activity._id}>
                                                <td className="font-medium">{activity.subject}</td>
                                                <td className="text-gray-500">{activity.location}</td>
                                                <td>
                                                    <span className={`badge badge-sm ${activity.status === 'approved' ? 'badge-success text-white' :
                                                        activity.status === 'pending' ? 'badge-warning text-white' :
                                                            'badge-ghost'
                                                        }`}>
                                                        {activity.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>No recent activity found.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions or Tips */}
                <div className="card bg-gradient-to-br from-primary to-primary-focus text-primary-content shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title">Need a Tutor?</h2>
                        <p>Post a tuition requirement and get connected with verified tutors in your area.</p>
                        <div className="card-actions justify-end mt-4">
                            <a href="/dashboard/student/post-tuition" className="btn btn-white text-primary hover:bg-gray-100 border-none">
                                Post Now
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentOverview;
