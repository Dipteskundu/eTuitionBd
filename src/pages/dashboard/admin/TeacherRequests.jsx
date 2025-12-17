import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { UserCheck, XCircle, CheckCircle, Clock } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import { motion } from 'framer-motion';

const TeacherRequests = () => {
    const axiosSecure = useAxiosSecure();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const res = await axiosSecure.get('/role-requests');
            setRequests(res.data);
        } catch (error) {
            console.error("Error fetching requests:", error);
            toast.error("Failed to load requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [axiosSecure]);

    const handleAction = async (id, status) => {
        try {
            await axiosSecure.patch(`/role-requests/${id}`, { status });
            toast.success(`Request ${status} successfully`);
            fetchRequests();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update request");
        }
    };

    if (loading) {
        return <div className="flex justify-center p-10"><span className="loading loading-bars loading-lg text-primary"></span></div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Teacher Role Requests</h1>

            <div className="card bg-base-100 shadow-xl border border-base-200">
                <div className="card-body p-0">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead className="bg-base-200">
                                <tr>
                                    <th>User</th>
                                    <th>Details</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-10 text-gray-500">No requests found</td>
                                    </tr>
                                ) : (
                                    requests.map((req) => (
                                        <tr key={req._id}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar placeholder">
                                                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                                                            <span>{req.userName?.charAt(0) || 'U'}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">{req.userName}</div>
                                                        <div className="text-sm opacity-50">{req.userEmail}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge badge-ghost capitalize">{req.currentRole} ➝ {req.requestedRole}</span>
                                            </td>
                                            <td>
                                                <div className={`badge ${req.status === 'approved' ? 'badge-success text-white' :
                                                    req.status === 'rejected' ? 'badge-error text-white' :
                                                        'badge-warning text-white'
                                                    }`}>
                                                    {req.status}
                                                </div>
                                            </td>
                                            <td>{new Date(req.created_at).toLocaleDateString()}</td>
                                            <td className="text-right">
                                                {req.status === 'pending' && (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleAction(req._id, 'approved')}
                                                            className="btn btn-success btn-xs text-white"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle size={14} /> Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(req._id, 'rejected')}
                                                            className="btn btn-error btn-xs text-white"
                                                            title="Reject"
                                                        >
                                                            <XCircle size={14} /> Reject
                                                        </button>
                                                    </div>
                                                )}
                                                {req.status !== 'pending' && (
                                                    <span className="text-xs text-gray-400 italic">Reviewed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherRequests;
