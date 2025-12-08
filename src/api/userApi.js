import axiosClient from './axiosClient';

// Get all users
// Get all users
export const getUsers = async () => {
    const response = await axiosClient.get('/tutors'); // Using /tutors as we have data there, mapped to users concept
    return response.data;
};

// Get user by ID
export const getUserById = async (id) => {
    const response = await axiosClient.get(`/tutors/${id}`);
    return response.data;
};

// Create a new user
export const createUser = async (data) => {
    const response = await axiosClient.post('/tutors', data);
    return response.data;
};

// Update user
export const updateUser = async (id, data) => {
    const response = await axiosClient.put(`/tutors/${id}`, data);
    return response.data;
};

// Delete user
export const deleteUser = async (id) => {
    const response = await axiosClient.delete(`/tutors/${id}`);
    return response.data;
};
