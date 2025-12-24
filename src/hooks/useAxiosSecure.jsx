import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
});

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { logOut } = useAuth();

    useEffect(() => {
        // Request Interceptor
        const requestInterceptor = axiosSecure.interceptors.request.use(function (config) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.authorization = `Bearer ${token}`;
            }
            return config;
        }, function (error) {
            return Promise.reject(error);
        });

        // Response Interceptor
        const responseInterceptor = axiosSecure.interceptors.response.use(function (response) {
            return response;
        }, async (error) => {
            const status = error.response ? error.response.status : null;

            // for 401 or 403 logout the user and move the user to the login
            if (status === 401 || status === 403) {
                await logOut();
                navigate('/login');
            }
            return Promise.reject(error);
        });

        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        }
    }, [logOut, navigate]);

    return axiosSecure;
};

export default useAxiosSecure;
