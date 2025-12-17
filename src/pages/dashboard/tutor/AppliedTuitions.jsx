import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Calendar, DollarSign, Briefcase, CheckCircle, XCircle, Clock, BookOpen } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import { motion } from 'framer-motion';

const AppliedTuitions = () => {
    const axiosSecure = useAxiosSecure();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await axiosSecure.get('/my-applications');
                setApplications(res.data);
            } catch (error) {
                console.error("Failed to fetch applications", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [axiosSecure]);

    if (loading) return <Spinner variant="dots" fullScreen />;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="badge badge-success gap-1 text-white font-bold"><CheckCircle size={12} /> Approved</span>;
            case 'rejected':
                return <span className="badge badge-error gap-1 text-white font-bold"><XCircle size={12} /> Rejected</span>;
            default:
                return <span className="badge badge-warning gap-1 text-white font-bold"><Clock size={12} /> Pending</span>;
        }
    };

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-heading font-bold gradient-text">My Applications</h1>
                <p className="text-base-content/70 mt-1">Track the status of your sent applications.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {applications.length === 0 ? (
                    <div className="col-span-full text-center py-10 bg-base-100 rounded-xl border border-base-200">
                        <p className="text-gray-500">You haven't applied to any tuitions yet.</p>
                        <a href="/dashboard/tutor/available-tuitions" className="btn btn-link">Browse Available Tuitions</a>
                    </div>
                ) : (
                    applications.map((app) => (
                        <div key={app._id} className="card bg-base-100 shadow-sm border border-base-200">
                            <div className="card-body">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="card-title text-base">Application ID: {app._id.substring(0, 8)}...</h2>
                                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                            <Calendar size={12} /> {new Date(app.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <span className={`badge ${app.status === 'approved' ? 'badge-success text-white' :
                                            app.status === 'rejected' ? 'badge-error text-white' :
                                                'badge-warning text-white'
                                        } `}>
                                        {app.status}
                                    </span>
                                </div>
                                <div className="divider my-2"></div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Expected Salary:</span>
                                        <span className="font-semibold">BDT {app.expectedSalary}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-gray-500">Experience Mentioned:</span>
                                        <p className="text-gray-700 bg-base-200 p-2 rounded text-xs">{app.experience}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AppliedTuitions;
