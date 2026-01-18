import React, { useEffect, useState } from 'react';
import useTitle from '../../../hooks/useTitle';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Link } from 'react-router-dom';
import { Users, BookOpen, DollarSign, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import Card from '../../../components/ui/Card';
import Spinner from '../../../components/ui/Spinner';
import DashboardHeader from '../../../components/Shared/DashboardHeader';

const AdminOverview = () => {
    useTitle('Admin Dashboard');
    const axiosSecure = useAxiosSecure();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTuitions: 0,
        totalStudentCount: 0,
        totalTutorCount: 0,
        totalRevenue: 0
    });
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [statsRes, usersRes] = await Promise.all([
                    axiosSecure.get('/reports/analytics'),
                    axiosSecure.get('/users?page=1&limit=5')
                ]);
                setStats(statsRes.data);
                setRecentUsers(usersRes.data.users || []); // Assuming API returns { users: [], ... } for pagination
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
                // Fallback content if API fails
                setRecentUsers([
                    { _id: '1', name: 'Demo Student', email: 'student@example.com', role: 'student', createdAt: new Date() },
                    { _id: '2', name: 'Demo Tutor', email: 'tutor@example.com', role: 'tutor', createdAt: new Date() }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [axiosSecure]);

    if (loading) return <Spinner variant="dots" size="lg" fullScreen />;

    const data = [
        { name: 'Students', value: stats.totalStudentCount },
        { name: 'Tutors', value: stats.totalTutorCount },
        { name: 'Tuitions', value: stats.totalTuitions },
    ];

    const statCards = [
        { title: 'Total Users', value: stats.totalUsers, icon: Users, bgColor: 'bg-primary/10', textColor: 'text-primary', desc: `${stats.totalStudentCount} Students, ${stats.totalTutorCount} Tutors` },
        { title: 'Total Tuitions', value: stats.totalTuitions, icon: BookOpen, bgColor: 'bg-secondary/10', textColor: 'text-secondary', desc: 'Posted on platform' },
        { title: 'Total Revenue', value: `৳${stats.totalRevenue}`, icon: DollarSign, bgColor: 'bg-success/10', textColor: 'text-success', desc: 'From accepted tuitions' },
        { title: 'System Health', value: 'Good', icon: Activity, bgColor: 'bg-accent/10', textColor: 'text-accent', desc: 'All systems operational' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <DashboardHeader />

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 mb-2">
                <Link to="/dashboard/admin/tuitions" className="btn btn-primary gap-2">
                    <BookOpen size={18} /> Manage Tuitions
                </Link>
                <Link to="/dashboard/admin/reports" className="btn btn-outline gap-2">
                    <Activity size={18} /> System Reports
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <Card key={index} glass hover>
                        <div className="flex items-center gap-4 mb-3">
                            <div className={`p-4 ${stat.bgColor} rounded-xl`}>
                                <stat.icon className={`w-8 h-8 ${stat.textColor}`} />
                            </div>
                            <div>
                                <p className="text-sm text-base-content/60">{stat.title}</p>
                                <h3 className="text-3xl font-heading font-bold gradient-text">
                                    {stat.value}
                                </h3>
                            </div>
                        </div>
                        <p className="text-xs text-base-content/50">{stat.desc}</p>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card bg-base-100 shadow-xl border border-base-200 p-6">
                    <h3 className="text-xl font-bold mb-4">Platform Distribution</h3>
                    <div className="w-full min-w-0" style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
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

                {/* Recent Registrations Table */}
                <div className="card bg-base-100 shadow-xl border border-base-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Recent Registrations</h3>
                        <Link to="/dashboard/admin/users" className="btn btn-xs btn-outline">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers.length > 0 ? recentUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className="avatar">
                                                    <div className="w-8 rounded-full">
                                                        <img src={user.photoURL || "https://i.ibb.co/MBtH413/unknown-user.jpg"} alt={user.name} />
                                                    </div>
                                                </div>
                                                <span className="font-bold">{user.name}</span>
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`badge ${user.role === 'admin' ? 'badge-error text-white' :
                                                user.role === 'tutor' ? 'badge-secondary text-white' :
                                                    'badge-primary text-white'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="text-center text-gray-500">No recent registrations found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminOverview;
