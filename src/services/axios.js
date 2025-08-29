import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
