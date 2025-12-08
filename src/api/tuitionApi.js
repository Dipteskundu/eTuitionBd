import axiosClient from './axiosClient';

// Get all tuitions with query params
export const getTuitions = async (params) => {
    // params is already an object, axios handles serializing it
    const response = await axiosClient.get('/tuitions', { params });
    return response.data;
};

// Get single tuition by ID
export const getTuitionById = async (id) => {
    const response = await axiosClient.get(`/tuitions/${id}`);
    return response.data;
};

// Create a new tuition post
export const createTuition = async (data) => {
    const response = await axiosClient.post('/tuitions', data);
    return response.data;
};
