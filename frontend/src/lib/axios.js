import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "https://job-portal-1w04.onrender.com",
    withCredentials: true,
});