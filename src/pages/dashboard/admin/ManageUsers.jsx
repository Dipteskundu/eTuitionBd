import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useToast from '../../../hooks/useToast';
import { Trash2, UserCheck, UserX, Shield } from 'lucide-react';
import Swal from 'sweetalert2';

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const { showToast } = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await axiosSecure.get('/users');
            setUsers(res.data);
        } catch (error) {
            console.error(error);
            showToast('Failed to fetch users', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [axiosSecure]);

    const handleRoleUpdate = async (id, newRole) => {
        try {
            const res = await axiosSecure.patch(`/update-role/${id}`, { role: newRole });
            if (res.data.modifiedCount > 0) {
                showToast(`User role updated to ${newRole}`, 'success');
                fetchUsers();
            }
        } catch (error) {
            console.error(error);
            showToast('Failed to update role', 'error');
        }
    };

    const handleDeleteUser = async (id) => {
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
                    const res = await axiosSecure.delete(`/user/${id}`);
                    if (res.data.deletedCount > 0) {
                        showToast('User deleted successfully.', 'success');
                        fetchUsers();
                    }
                } catch (error) {
                    console.error(error);
                    showToast('Failed to delete user', 'error');
                }
            }
        });
    };

    if (loading) return <div className="p-10 text-center"><span className="loading loading-dots loading-lg text-primary"></span></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Users</h1>

            <div className="overflow-x-auto bg-base-100 rounded-xl shadow-sm border border-base-200">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id}>
                                <th>{index + 1}</th>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`badge ${user.role === 'admin' ? 'badge-primary' :
                                            user.role === 'tutor' ? 'badge-secondary' :
                                                'badge-accent'
                                        } badge-outline uppercase text-xs font-bold`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="flex gap-2">
                                    {/* Role Buttons */}
                                    {user.role !== 'admin' && (
                                        <button
                                            onClick={() => handleRoleUpdate(user._id, 'admin')}
                                            className="btn btn-xs btn-outline btn-primary"
                                            title="Make Admin"
                                        >
                                            <Shield size={14} /> Admin
                                        </button>
                                    )}
                                    {user.role !== 'tutor' && (
                                        <button
                                            onClick={() => handleRoleUpdate(user._id, 'tutor')}
                                            className="btn btn-xs btn-outline btn-secondary"
                                            title="Make Tutor"
                                        >
                                            <UserCheck size={14} /> Tutor
                                        </button>
                                    )}
                                    {user.role !== 'student' && (
                                        <button
                                            onClick={() => handleRoleUpdate(user._id, 'student')}
                                            className="btn btn-xs btn-outline btn-accent"
                                            title="Make Student"
                                        >
                                            <UserCheck size={14} /> Student
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDeleteUser(user._id)}
                                        className="btn btn-xs btn-ghost text-error ml-2"
                                        title="Delete User"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
