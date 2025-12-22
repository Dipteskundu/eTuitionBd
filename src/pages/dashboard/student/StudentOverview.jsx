import React, { useEffect, useState } from 'react';
import useTitle from '../../../hooks/useTitle';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { LayoutDashboard, FileText, CheckCircle, DollarSign, Activity, Clock, Users, BookOpen } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Spinner from '../../../components/ui/Spinner';
import DashboardHeader from '../../../components/Shared/DashboardHeader';
import BecomeTeacherModal from '../../../components/BecomeTeacherModal';

const StudentOverview = () => {
    useTitle('Student Dashboard');
    const { user, role } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [stats, setStats] = useState({
        totalTuitions: 0,
        activeTuitions: 0,
        completedTuitions: 0,
        totalSpent: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [roleRequests, setRoleRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBecomeTeacherModal, setShowBecomeTeacherModal] = useState(false);

    const pendingRequest = roleRequests.find(req => req.status === 'pending');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const statsRes = await axiosSecure.get('/student/dashboard-stats');
                setStats(statsRes.data);

                const activityRes = await axiosSecure.get('/student/recent-activities');
                setRecentActivity(activityRes.data);

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
        return <Spinner variant="dots" size="lg" fullScreen />;
    }

    const statCards = [
        { title: 'Total Posted', value: stats.totalTuitions, icon: FileText, bgColor: 'bg-primary/10', textColor: 'text-primary' },
        { title: 'Active Tuitions', value: stats.activeTuitions, icon: Activity, bgColor: 'bg-secondary/10', textColor: 'text-secondary' },
        { title: 'Completed', value: stats.completedTuitions, icon: CheckCircle, bgColor: 'bg-accent/10', textColor: 'text-accent' },
        { title: 'Total Spent', value: `৳${stats.totalSpent}`, icon: DollarSign, bgColor: 'bg-success/10', textColor: 'text-success' },
    ];

    return (
        <div className="space-y-6">
            <DashboardHeader />

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 mb-6">
                {role === 'tutor' ? (
                    <Link to="/dashboard/tutor" className="btn btn-primary gap-2">
                        <LayoutDashboard size={18} /> Tutor Dashboard
                    </Link>
                ) : pendingRequest ? (
                    <button className="btn btn-warning gap-2" disabled>
                        <Clock size={18} /> Tutor Application Pending
                    </button>
                ) : (
                    <button onClick={() => setShowBecomeTeacherModal(true)} className="btn btn-primary gap-2">
                        <Users size={18} /> Become a Tutor
                    </button>
                )}
                <Link to="/tuitions" className="btn btn-outline gap-2">
                    <BookOpen size={18} /> Browse Tuitions
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <Card key={index} glass hover>
                        <div className="flex items-center gap-4">
                            <div className={`p-4 ${stat.bgColor} rounded-xl`}>
                                <stat.icon className={`w-8 h-8 ${stat.textColor}`} />
                            </div>
                            <div>
                                <p className="text-sm text-base-content/60">{stat.title}</p>
                                <h3 className="text-3xl font-heading font-bold text-primary">
                                    {stat.value}
                                </h3>
                            </div>
                        </div>
                    </Card>
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
                <div className="card bg-primary text-primary-content shadow-lg">
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
