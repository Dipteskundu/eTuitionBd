import React, { useEffect, useState } from 'react';
import useTitle from '../../../hooks/useTitle';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useToast from '../../../hooks/useToast';
import { Pencil, Trash2, Eye, Users, FileText, MapPin, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import { motion } from 'framer-motion';

const MyTuitions = () => {
    useTitle('My Tuitions');
    const axiosSecure = useAxiosSecure();
    const { success, error } = useToast();
    const [tuitions, setTuitions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTuitions = async () => {
        try {
            const res = await axiosSecure.get('/my-tuitions');
            setTuitions(res.data);
        } catch (err) {
            console.error(err);
            error('Failed to fetch tuitions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTuitions();
    }, [axiosSecure]);

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Delete Tuition?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff6b6b',
            cancelButtonColor: '#cbd5e1',
            confirmButtonText: 'Yes, delete it',
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'px-6 py-2.5 rounded-xl font-bold',
                cancelButton: 'px-6 py-2.5 rounded-xl font-bold'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.delete(`/tuition/${id}`);
                    if (res.data.deletedCount > 0) {
                        success('Tuition deleted successfully.');
                        fetchTuitions();
                    }
                } catch (err) {
                    console.error(err);
                    error('Failed to delete tuition.');
                }
            }
        });
    };

    if (loading) {
        return <Spinner fullScreen variant="dots" />;
    }

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-center gap-4"
            >
                <div>
                    <h1 className="text-3xl font-heading font-bold gradient-text">My Tuition Posts</h1>
                    <p className="text-base-content/70">Manage your tuition requests and applications.</p>
                </div>
                <Link to="/dashboard/student/post-tuition">
                    <Button variant="primary" leftIcon={FileText} className="shadow-lg shadow-primary/20">
                        Post New Tuition
                    </Button>
                </Link>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
            >
                <Card glass className="p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="bg-base-200/50 text-base-content">
                                    <th className="py-4 px-6 text-sm font-bold uppercase tracking-wider">Subject & Location</th>
                                    <th className="py-4 px-6 text-sm font-bold uppercase tracking-wider">Class Info</th>
                                    <th className="py-4 px-6 text-sm font-bold uppercase tracking-wider">Salary</th>
                                    <th className="py-4 px-6 text-sm font-bold uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-6 text-sm font-bold uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tuitions.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center opacity-50">
                                                <FileText size={48} className="mb-4 text-base-content/30" />
                                                <p className="text-lg font-medium">You haven't posted any tuitions yet.</p>
                                                <Link to="/dashboard/student/post-tuition" className="mt-4 text-primary font-bold hover:underline">
                                                    Post your first tuition
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    tuitions.map((item, index) => (
                                        <motion.tr
                                            key={item._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + (index * 0.05) }}
                                            className="hover:bg-base-100/50 transition-colors border-b border-base-200/50 last:border-0"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-lg text-primary">{item.subject}</div>
                                                <div className="text-sm opacity-70 flex items-center gap-1">
                                                    <MapPin size={12} /> {item.location}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium">{item.class}</div>
                                                <span className="badge badge-sm badge-ghost mt-1">{item.medium}</span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-secondary">
                                                ৳ {item.salary}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`badge border-0 px-3 py-2 font-bold ${item.status === 'approved' ? 'bg-info/10 text-info' :
                                                        item.status === 'pending' ? 'bg-warning/10 text-warning' :
                                                            'bg-error/10 text-error'
                                                        } `}>
                                                        {item.status.toUpperCase()}
                                                    </span>
                                                    {item.assignedTutorEmail && (
                                                        <span className="badge bg-success/10 text-success border-0 px-3 py-2 font-bold flex items-center gap-1">
                                                            <CheckCircle size={10} /> HIRED
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {(item.status === 'pending' || item.status === 'approved') && (
                                                        <div className="flex gap-1">
                                                            <Link
                                                                to={`/dashboard/student/update-tuition/${item._id}`}
                                                                className="btn btn-square btn-ghost btn-sm text-primary hover:bg-primary/10"
                                                                title="Edit Tuition"
                                                            >
                                                                <Pencil size={18} />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(item._id)}
                                                                className="btn btn-square btn-ghost btn-sm text-error hover:bg-error/10"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    )}
                                                    <Link
                                                        to={`/tuitions/${item._id}`}
                                                        className="btn btn-square btn-ghost btn-sm text-info hover:bg-info/10"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </Link>
                                                    <Link
                                                        to={`/dashboard/student/applications/${item._id}`}
                                                        className="btn btn-sm btn-outline btn-primary gap-2 hover:shadow-lg shadow-primary/20"
                                                        title="View Applications"
                                                    >
                                                        <Users size={16} />
                                                        Applications
                                                    </Link>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default MyTuitions;
