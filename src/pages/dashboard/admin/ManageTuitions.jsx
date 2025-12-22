import React, { useEffect, useState } from 'react';
import useTitle from '../../../hooks/useTitle';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useToast from '../../../hooks/useToast';
import { Eye, CheckCircle, XCircle, User, BookOpen, MapPin, DollarSign, Calendar, MoreVertical, LayoutGrid, Table as TableIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Spinner from '../../../components/ui/Spinner';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';

const ManageTuitions = () => {
    useTitle('Manage Tuitions');
    const axiosSecure = useAxiosSecure();
    const { success, error } = useToast();
    const [tuitions, setTuitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid' (automatic switch based on screen too)

    const fetchTuitions = async () => {
        try {
            const res = await axiosSecure.get('/admin/tuitions');
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

    const handleStatusUpdate = async (id, status) => {
        try {
            const res = await axiosSecure.patch(`/tuition-status/${id}`, { status });
            if (res.data.modifiedCount > 0) {
                success(`Tuition marked as ${status}`);
                fetchTuitions();
            }
        } catch (err) {
            console.error(err);
            error('Failed to update status');
        }
    };

    if (loading) return <Spinner variant="dots" fullScreen />;

    const ActionButtons = ({ item, condensed = false }) => (
        <div className={`flex flex-wrap gap-2 ${condensed ? 'justify-start' : 'justify-end'}`}>
            <Link
                to={`/tuitions/${item._id}`}
                className={`btn btn-xs btn-outline btn-info gap-1 ${condensed ? 'flex-1' : ''}`}
                title="View Public Post"
            >
                <Eye size={12} />
                {!condensed && 'View'}
            </Link>

            <Link
                to={`/dashboard/admin/student-profile/${item.studentId}`}
                className={`btn btn-xs btn-outline btn-primary gap-1 ${condensed ? 'flex-1' : ''}`}
                title="View Student"
            >
                <User size={12} />
                {!condensed && 'Student'}
            </Link>

            {(item.status === 'pending' || item.status === 'rejected') && (
                <button
                    onClick={() => handleStatusUpdate(item._id, 'approved')}
                    className={`btn btn-xs btn-success text-white gap-1 ${condensed ? 'flex-1' : ''}`}
                >
                    <CheckCircle size={12} />
                    Approve
                </button>
            )}

            {item.status === 'approved' && (
                <button
                    onClick={() => handleStatusUpdate(item._id, 'rejected')}
                    className={`btn btn-xs btn-error text-white gap-1 ${condensed ? 'flex-1' : ''}`}
                >
                    <XCircle size={12} />
                    Reject
                </button>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold font-heading">Manage Tuitions</h1>
                    <p className="text-sm text-base-content/60">Moderate and manage all tuition posts.</p>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-hidden bg-base-100 rounded-2xl shadow-sm border border-base-200">
                <table className="table w-full">
                    <thead className="bg-base-200/50">
                        <tr>
                            <th className="rounded-none">Tuition Details</th>
                            <th>Info</th>
                            <th>Compensation</th>
                            <th>Status</th>
                            <th className="text-right rounded-none">Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tuitions.map((item) => (
                            <tr key={item._id} className="hover:bg-base-200/30 transition-colors">
                                <td>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-primary">{item.subject}</span>
                                        <span className="text-[10px] opacity-30 font-mono">ID: {item._id}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1 text-xs">
                                            <BookOpen size={12} className="text-info" />
                                            {item.class}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs opacity-60">
                                            <MapPin size={12} />
                                            {item.location}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="font-bold text-secondary">৳ {item.salary}</div>
                                    <div className="text-[10px] opacity-50">{item.daysPerWeek} days/week</div>
                                </td>
                                <td>
                                    <div className="flex flex-col gap-1">
                                        <span className={`badge badge-sm font-bold border-0 px-2 ${item.status === 'approved' ? 'bg-success/10 text-success' :
                                            item.status === 'rejected' ? 'bg-error/10 text-error' :
                                                'bg-warning/10 text-warning'
                                            }`}>
                                            {item.status ? item.status.toUpperCase() : 'PENDING'}
                                        </span>
                                        {item.assignedTutorEmail && (
                                            <span className="text-[10px] text-info font-bold flex items-center gap-1">
                                                <CheckCircle size={8} /> HIRED
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <ActionButtons item={item} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden grid grid-cols-1 gap-4">
                {tuitions.map((item) => (
                    <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card glass className="p-4 border border-base-200">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-lg text-primary leading-tight">{item.subject}</h3>
                                    <span className="text-[10px] opacity-40 font-mono uppercase tracking-tighter">ID: {item._id.slice(-8)}</span>
                                </div>
                                <span className={`badge badge-sm font-bold border-0 ${item.status === 'approved' ? 'bg-success/10 text-success' :
                                    item.status === 'rejected' ? 'bg-error/10 text-error' :
                                        'bg-warning/10 text-warning'
                                    }`}>
                                    {item.status ? item.status.toUpperCase() : 'PENDING'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                <div className="space-y-1">
                                    <p className="flex items-center gap-2 opacity-70">
                                        <BookOpen size={14} className="text-info" /> {item.class}
                                    </p>
                                    <p className="flex items-center gap-2 opacity-70">
                                        <MapPin size={14} className="text-error" /> {item.location}
                                    </p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="font-bold text-secondary">৳ {item.salary}</p>
                                    <p className="text-xs opacity-50">{item.daysPerWeek} days/week</p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-base-200">
                                <p className="text-xs font-bold mb-2 opacity-40 uppercase tracking-widest">Management Operations</p>
                                <ActionButtons item={item} condensed={true} />
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {tuitions.length === 0 && (
                <div className="text-center py-20 bg-base-100 rounded-2xl border-2 border-dashed border-base-200 opacity-50">
                    <p className="text-xl">No tuition posts found to manage.</p>
                </div>
            )}
        </div>
    );
};

export default ManageTuitions;
