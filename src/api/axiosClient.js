import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 8000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
axiosClient.interceptors.request.use(
    (config) => {
        console.log(`[Request] ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const { status } = error.response;
            switch (status) {
                case 400:
                    console.error('Bad Request (400)');
                    break;
                case 401:
                    console.error('Unauthorized (401)');
                    break;
                case 403:
                    console.error('Forbidden (403)');
                    break;
                case 500:
                    console.error('Server Error (500)');
                    break;
                default:
                    console.error(`HTTP Error: ${status}`);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
