import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useToast from '../../../hooks/useToast';
import { Pencil, Trash2, Eye, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const MyTuitions = () => {
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
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
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
        return <div className="flex justify-center items-center h-full"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Tuition Posts</h1>
                <Link to="/dashboard/student/post-tuition" className="btn btn-primary btn-sm">
                    + Post New Tuition
                </Link>
            </div>

            <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Class/Medium</th>
                                <th>Salary</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tuitions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-gray-500">
                                        You haven't posted any tuitions yet.
                                    </td>
                                </tr>
                            ) : (
                                tuitions.map((item) => (
                                    <tr key={item._id}>
                                        <td>
                                            <div className="font-bold">{item.subject}</div>
                                            <div className="text-xs opacity-50">{item.location}</div>
                                        </td>
                                        <td>
                                            {item.class}<br />
                                            <span className="badge badge-ghost badge-sm">{item.medium}</span>
                                        </td>
                                        <td>BDT {item.salary}</td>
                                        <td>
                                            <span className={`badge ${item.status === 'approved' ? 'badge-info text-white' : // Approved by Admin, Waiting for Tutor
                                                item.status === 'ongoing' ? 'badge-success text-white' : // Ongoing = Hired
                                                    item.status === 'pending' ? 'badge-warning text-white' : // Pending Admin Review
                                                        'badge-error text-white'
                                                } uppercase`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="flex gap-2">
                                            {(item.status === 'pending' || item.status === 'approved') && (
                                                <>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="btn btn-square btn-ghost btn-sm text-error"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                            <Link
                                                to={`/tuitions/${item._id}`}
                                                className="btn btn-square btn-ghost btn-sm text-info"
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            <Link
                                                to={`/dashboard/student/applications?tuitionId=${item._id}`}
                                                className="btn btn-sm btn-outline btn-primary gap-2"
                                            >
                                                <Users size={16} />
                                                Applications
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyTuitions;
