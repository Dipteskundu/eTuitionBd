import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Users, BookOpen, DollarSign, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../../../components/ui/Card';
import Spinner from '../../../components/ui/Spinner';
import { motion } from 'framer-motion';

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

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1
                variants={itemVariants}
                className="font-heading text-4xl font-bold gradient-text"
            >
                Dashboard Overview
            </motion.h1>

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
        </motion.div>
    );
};

export default AdminOverview;
