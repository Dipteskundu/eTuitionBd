import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useTitle from '../../../hooks/useTitle';
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
    useTitle('Manage Users');
    const axiosSecure = useAxiosSecure();
    const toast = useToast();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch users with TanStack Query
    const { data: users = [], isLoading: loading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        },
    });

    // Update role mutation
    const updateRoleMutation = useMutation({
        mutationFn: async ({ id, role }) => {
            const res = await axiosSecure.patch(`/update-role/${id}`, { role });
            return res.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['users']);
            toast.success(`User role updated to ${variables.role}`);
            Swal.fire({
                title: 'Updated!',
                text: `User role has been changed to ${variables.role}.`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        },
        onError: (error) => {
            console.error(error);
            toast.error('Failed to update role');
        },
    });

    // Delete user mutation
    const deleteUserMutation = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.delete(`/user/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            toast.success('User deleted successfully');
        },
        onError: (error) => {
            console.error(error);
            toast.error('Failed to delete user');
        },
    });

    const handleRoleUpdate = async (id, newRole) => {
        // Show confirmation dialog
        const result = await Swal.fire({
            title: 'Update User Role?',
            text: `Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, make ${newRole}!`,
            cancelButtonText: 'Cancel'
        });

        if (!result.isConfirmed) return;

        // Use mutation instead of manual API call
        updateRoleMutation.mutate({ id, role: newRole });
    };

    const handleDeleteUser = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            deleteUserMutation.mutate(id);
        }
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
            render: (role, user) => (
                <span
                    onClick={() => role !== 'admin' && handleRoleUpdate(user._id, 'admin')}
                    className={`badge ${role === 'admin' ? 'badge-primary' :
                        role === 'tutor' ? 'badge-secondary' :
                            'badge-accent'
                        } badge-lg gap-1 uppercase font-bold text-white text-[10px] ${role !== 'admin' ? 'cursor-pointer hover:scale-110 active:scale-95 transition-all' : ''}`}
                    title={role !== 'admin' ? "Click to make Admin" : "User is Admin"}
                >
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
