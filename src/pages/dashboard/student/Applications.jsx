import React, { useEffect, useState } from 'react';
import useTitle from '../../../hooks/useTitle';
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import useToast from '../../../hooks/useToast';
import { User, DollarSign, CreditCard, BookOpen, Clock, Briefcase, GraduationCap, ArrowLeft, Trash2, XCircle, CheckCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Modal from '../../../components/ui/Modal';
import Spinner from '../../../components/ui/Spinner';
import Input from '../../../components/ui/Input';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';

const Applications = () => {
    useTitle('Applications');
    const { tuitionId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const toast = useToast();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tuitionDetails, setTuitionDetails] = useState(null);

    // Payment State removed

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (tuitionId) {
                    // Specific Tuition Mode
                    const tuitionRes = await axiosSecure.get(`/tuitions/${tuitionId}`);
                    setTuitionDetails(tuitionRes.data);
                    const appsRes = await axiosSecure.get(`/applications/${tuitionId}`);
                    setApplications(appsRes.data);
                } else if (user?.email) {
                    // All Applications Mode
                    const appsRes = await axiosSecure.get(`/student-applications/${user.email}`);
                    setApplications(appsRes.data);
                }
            } catch (error) {
                console.error(error);
                toast.error('Failed to load applications.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [tuitionId, axiosSecure, user?.email]);

    const handleAcceptClick = async (app) => {
        const result = await Swal.fire({
            title: 'Accept this Tutor?',
            text: `Are you sure you want to accept ${app.tutorName || 'this tutor'}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed to payment',
            cancelButtonText: 'Cancel',
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'px-6 py-2.5 rounded-xl font-bold',
                cancelButton: 'px-6 py-2.5 rounded-xl font-bold'
            }
        });

        if (result.isConfirmed) {
            navigate(`/dashboard/payment/${app._id}`);
        }
    };

    // Consolidated delete logic for brevity since payment logic is moved
    const handleDelete = async (appId) => {
        const result = await Swal.fire({
            title: 'Delete Application?',
            text: "This will remove the application permanently.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#cbd5e1',
            confirmButtonText: 'Yes, Delete',
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'px-6 py-2.5 rounded-xl font-bold',
                cancelButton: 'px-6 py-2.5 rounded-xl font-bold'
            }
        });

        if (!result.isConfirmed) return;

        try {
            const res = await axiosSecure.delete(`/applications/${appId}`);
            if (res.data.deletedCount > 0) {
                toast.success('Application deleted.');
                setApplications(prev => prev.filter(app => app._id !== appId));
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete application.');
        }
    };

    // Kept handleReject for status update logic if preferred, but user requested Delete. 
    // We can keep both or replacing Reject with Delete? User prompt says "Accept / Reject / Delete". So we usually need all 3.
    // I'll keep Reject as status update (PATCH) and add Delete (DELETE) as a separate option.

    const handleReject = async (appId) => {
        const result = await Swal.fire({
            title: 'Reject this Tutor?',
            text: "Do you want to reject this application? (Status will be 'rejected')",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#cbd5e1',
            confirmButtonText: 'Yes, Reject',
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'px-6 py-2.5 rounded-xl font-bold',
                cancelButton: 'px-6 py-2.5 rounded-xl font-bold'
            }
        });

        if (!result.isConfirmed) return;

        try {
            // Updated to PATCH /applications/:id
            const res = await axiosSecure.patch(`/applications/${appId}`, { status: 'rejected' });
            if (res.data.modifiedCount > 0) {
                toast.success('Application rejected.');
                setApplications(prev => prev.map(app =>
                    app._id === appId ? { ...app, status: 'rejected' } : app
                ));
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to reject application.');
        }
    };

    if (loading) return <Spinner fullScreen variant="dots" />;

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-primary/5 p-6 rounded-2xl border border-primary-500/10"
            >
                <div>
                    <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<ArrowLeft size={18} />}
                        onClick={() => navigate(-1)}
                        className="mb-2 -ml-2"
                    >
                        Back
                    </Button>
                    <h1 className="text-3xl font-heading font-bold text-primary">
                        {tuitionId ? 'Review Applications' : 'All Received Applications'}
                    </h1>
                    {tuitionDetails && (
                        <p className="text-base-content/70 mt-1 flex flex-wrap items-center gap-2">
                            For: <span className="font-bold text-primary">{tuitionDetails.subject}</span>
                            <span className="badge badge-ghost badge-sm">{tuitionDetails.class}</span>
                            <span className="flex items-center gap-1 text-secondary font-bold text-sm bg-secondary/10 px-2 py-0.5 rounded-md">
                                <DollarSign size={12} /> {tuitionDetails.salary}
                            </span>
                        </p>
                    )}
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {applications.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full text-center py-16 text-base-content/50 bg-base-100/50 rounded-2xl border border-base-200"
                        >
                            <div className="flex flex-col items-center justify-center">
                                <User size={48} className="mb-4 opacity-30" />
                                <p className="text-lg">No applications received yet.</p>
                            </div>
                        </motion.div>
                    ) : (
                        applications.map((app, index) => (
                            <motion.div
                                key={app._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card glass className="h-full flex flex-col hover:border-primary/30 transition-all duration-300">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex gap-4">
                                            <div className="avatar placeholder">
                                                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center ring-2 ring-base-100 shadow-md">
                                                    <span className="text-xl font-bold">
                                                        {app.tutorName ? app.tutorName[0].toUpperCase() : 'T'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <h2 className="font-bold text-lg leading-tight cursor-pointer hover:text-primary transition-colors" onClick={() => navigate(`/tutors/${app.tutorEmail}`)}>
                                                    {app.tutorName || app.tutorEmail}
                                                </h2>
                                                <p className="text-xs text-base-content/60 mt-0.5 flex items-center gap-1">
                                                    <Clock size={12} /> Applied: {new Date(app.created_at).toLocaleDateString()}
                                                </p>
                                                {!tuitionId && app.tuitionTitle && (
                                                    <div className="badge badge-outline badge-xs mt-1.5 opacity-70">
                                                        {app.tuitionTitle}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`badge font-bold border-0 ${app.status === 'approved' ? 'bg-success/10 text-success' :
                                            app.status === 'rejected' ? 'bg-error/10 text-error' :
                                                'bg-warning/10 text-warning'
                                            } `}>
                                            {app.status.toUpperCase()}
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="flex-1 space-y-3 mb-6">
                                        {app.message && (
                                            <div className="bg-base-200/50 p-3 rounded-xl text-sm italic text-base-content/80 border border-base-200">
                                                "{app.message}"
                                            </div>
                                        )}

                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between items-center py-1 border-b border-base-200/50">
                                                <span className="text-base-content/60 flex items-center gap-2"><Clock size={14} /> Availability</span>
                                                <span className="font-medium text-right">{app.availability || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-1 border-b border-base-200/50">
                                                <span className="text-base-content/60 flex items-center gap-2"><Briefcase size={14} /> Experience</span>
                                                <span className="font-medium text-right">{app.experience || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-1 border-b border-base-200/50">
                                                <span className="text-base-content/60 flex items-center gap-2"><GraduationCap size={14} /> Qualification</span>
                                                <span className="font-medium text-right">{app.qualification || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-1">
                                                <span className="text-base-content/60 flex items-center gap-2"><DollarSign size={14} /> Expected</span>
                                                <span className="font-bold text-primary">BDT {app.expectedSalary || tuitionDetails?.salary}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 mt-auto pt-4 border-t border-base-200">
                                        <button
                                            onClick={() => navigate(`/tutors/${app.tutorEmail}`)}
                                            className="btn btn-sm btn-ghost btn-circle tooltip tooltip-top"
                                            data-tip="View Profile"
                                        >
                                            <User size={18} />
                                        </button>

                                        <div className="flex-1 flex justify-end gap-2">
                                            {app.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleReject(app._id)}
                                                        className="btn btn-sm btn-ghost text-error hover:bg-error/10"
                                                        title="Reject"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>

                                                    <Button
                                                        onClick={() => handleAcceptClick(app)}
                                                        size="sm"
                                                        variant="gradient"
                                                        leftIcon={CheckCircle}
                                                        className="shadow-md shadow-primary/20"
                                                    >
                                                        Hire
                                                    </Button>
                                                </>
                                            )}
                                            {app.status === 'approved' && (
                                                <Button size="sm" variant="success" className="w-full cursor-default" leftIcon={CheckCircle}>
                                                    Hired
                                                </Button>
                                            )}
                                            {app.status === 'rejected' && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="w-full cursor-default text-error bg-error/5 hover:bg-error/10"
                                                    leftIcon={XCircle}
                                                >
                                                    Rejected
                                                </Button>
                                            )}
                                            {(app.status !== 'pending' && app.status !== 'approved') && (
                                                <button
                                                    onClick={() => handleDelete(app._id)}
                                                    className="btn btn-sm btn-ghost text-base-content/50 hover:text-error"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Premium Payment Modal Removed - Using Dedicated Page */}
        </div>
    );
};

export default Applications;
