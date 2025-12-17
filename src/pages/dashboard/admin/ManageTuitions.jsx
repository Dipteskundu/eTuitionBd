import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useToast from '../../../hooks/useToast';
import { Eye, CheckCircle, XCircle, User, BookOpen, MapPin, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import Spinner from '../../../components/ui/Spinner';
import Button from '../../../components/ui/Button';

const ManageTuitions = () => {
    const axiosSecure = useAxiosSecure();
    const { success, error } = useToast();
    const [tuitions, setTuitions] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="overflow-x-auto bg-base-100 rounded-xl shadow-sm border border-base-200">
            <table className="table w-full">
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Class/Loc</th>
                        <th>Salary</th>
                        <th>Status (State)</th>
                        <th>Moderation</th>
                    </tr>
                </thead>
                <tbody>
                    {tuitions.map((item) => (
                        <tr key={item._id}>
                            <td>
                                <div className="font-bold">{item.subject}</div>
                                <div className="text-xs opacity-50">ID: {item._id.slice(-6)}</div>
                            </td>
                            <td>
                                <div className="text-sm">{item.class}</div>
                                <div className="text-xs text-gray-500">{item.location}</div>
                            </td>
                            <td>BDT {item.salary}</td>
                            <td>
                                <span className={`badge ${item.status === 'approved' ? 'badge-success text-white' :
                                    item.status === 'closed' ? 'badge-neutral text-white' :
                                        item.status === 'rejected' ? 'badge-error text-white' :
                                            'badge-warning text-white'
                                    }`}>
                                    {item.status ? item.status.toUpperCase() : 'UNKNOWN'}
                                </span>
                            </td>
                            <td className="flex gap-2">
                                {/* View Public Details */}
                                <Link to={`/tuitions/${item._id}`} className="btn btn-square btn-ghost btn-sm text-info" title="View Post Details">
                                    <Eye size={16} />
                                </Link>

                                {/* View Student Profile */}
                                <Link to={`/dashboard/admin/student-profile/${item.studentId}`} className="btn btn-square btn-ghost btn-sm text-primary" title="View Student Profile">
                                    <User size={16} />
                                </Link>

                                {/* Approve Button (for Pending or Rejected) */}
                                {(item.status === 'pending' || item.status === 'rejected') && (
                                    <button
                                        onClick={() => handleStatusUpdate(item._id, 'approved')}
                                        className="btn btn-sm btn-ghost text-success"
                                        title="Approve Post"
                                    >
                                        <CheckCircle size={16} />
                                    </button>
                                )}

                                {/* Reject Button (for Approved) */}
                                {item.status === 'approved' && (
                                    <button
                                        onClick={() => handleStatusUpdate(item._id, 'rejected')}
                                        className="btn btn-sm btn-ghost text-error"
                                        title="Reject Post"
                                    >
                                        <XCircle size={16} />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageTuitions;
