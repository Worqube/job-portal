import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "https://job-portal-6nsa.onrender.com",
    withCredentials: true,
});