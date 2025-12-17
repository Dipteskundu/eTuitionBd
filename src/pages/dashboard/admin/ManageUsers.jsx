import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useToast from '../../../hooks/useToast';
import { Trash2, UserCheck, Shield, BookOpen, Search, User } from 'lucide-react';
import Swal from 'sweetalert2';
import Table from '../../../components/ui/Table';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { motion } from 'framer-motion';

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const { showToast } = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
            title: 'Delete User?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#error',
            cancelButtonColor: '#gray',
            confirmButtonText: 'Yes, delete it!',
            customClass: {
                popup: 'rounded-xl',
                confirmButton: 'btn btn-error text-white',
                cancelButton: 'btn btn-ghost'
            }
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

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            header: 'User Info',
            accessor: 'name',
            render: (_, user) => (
                <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                        <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                            <span className="text-lg font-bold uppercase">{user.name?.charAt(0) || 'U'}</span>
                        </div>
                    </div>
                    <div>
                        <div className="font-bold">{user.name}</div>
                        <div className="text-xs opacity-50">{user.email}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Current Role',
            accessor: 'role',
            render: (role) => (
                <span className={`badge ${role === 'admin' ? 'badge-primary' :
                        role === 'tutor' ? 'badge-secondary' :
                            'badge-accent'
                    } badge-lg gap-1 uppercase font-bold text-white text-[10px]`}>
                    {role === 'admin' && <Shield size={12} />}
                    {role === 'tutor' && <BookOpen size={12} />}
                    {role === 'student' && <User size={12} />}
                    {role}
                </span>
            )
        },
        {
            header: 'Change Role',
            accessor: 'role',
            render: (_, user) => (
                <div className="join">
                    {user.role !== 'admin' && (
                        <button
                            onClick={() => handleRoleUpdate(user._id, 'admin')}
                            className="btn btn-xs btn-outline btn-primary join-item"
                            title="Make Admin"
                        >
                            <Shield size={12} /> Admin
                        </button>
                    )}
                    {user.role !== 'tutor' && (
                        <button
                            onClick={() => handleRoleUpdate(user._id, 'tutor')}
                            className="btn btn-xs btn-outline btn-secondary join-item"
                            title="Make Tutor"
                        >
                            <BookOpen size={12} /> Tutor
                        </button>
                    )}
                    {user.role !== 'student' && (
                        <button
                            onClick={() => handleRoleUpdate(user._id, 'student')}
                            className="btn btn-xs btn-outline btn-accent join-item"
                            title="Make Student"
                        >
                            <User size={12} /> Student
                        </button>
                    )}
                </div>
            )
        },
        {
            header: 'Actions',
            accessor: '_id',
            render: (id) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-error hover:bg-error/10"
                    onClick={() => handleDeleteUser(id)}
                >
                    <Trash2 size={16} />
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-heading font-bold gradient-text">User Management</h1>
                <p className="text-base-content/70 mt-1">Manage user accounts and permissions.</p>
            </motion.div>

            <Card glass className="p-0 overflow-hidden">
                <div className="p-6 border-b border-base-200 bg-base-100/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <UserCheck className="text-primary" /> Total Users: {users.length}
                    </h2>
                    <div className="w-full md:w-72">
                        <Input
                            placeholder="Search users..."
                            leftIcon={Search}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-base-100"
                        />
                    </div>
                </div>

                <div className="p-0">
                    <Table
                        columns={columns}
                        data={filteredUsers}
                        loading={loading}
                        hoverable
                        striped
                    />
                </div>
            </Card>
        </div>
    );
};

export default ManageUsers;
