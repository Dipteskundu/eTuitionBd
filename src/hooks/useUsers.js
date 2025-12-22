import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

/**
 * Custom hook for managing users with TanStack Query
 * Provides data fetching, caching, and mutations for user management
 */
export const useUsers = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // Fetch all users
    const usersQuery = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Update user role mutation
    const updateRoleMutation = useMutation({
        mutationFn: async ({ id, role }) => {
            const res = await axiosSecure.patch(`/update-role/${id}`, { role });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
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
        },
    });

    return {
        users: usersQuery.data || [],
        isLoading: usersQuery.isLoading,
        isError: usersQuery.isError,
        error: usersQuery.error,
        updateRole: updateRoleMutation.mutate,
        deleteUser: deleteUserMutation.mutate,
        isUpdatingRole: updateRoleMutation.isPending,
        isDeletingUser: deleteUserMutation.isPending,
    };
};

export default useUsers;
