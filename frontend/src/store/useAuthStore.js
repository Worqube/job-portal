import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isCheckingAuth: false,
    isLoggingIn: false,
    isLoggingOut: false,

    checkAuth: async (data) => {
        set({ isCheckingAuth: true });
        const token = sessionStorage.getItem("token");
        if (!token) {
            set({ authUser: null, isCheckingAuth: false });
            return;
        }
        try {
            const res = await axiosInstance.get('/auth/check', {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ authUser: res.data.user });
        } catch (error) {
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false })
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/auth/signup', data);
            set({ authUser: res.data });
            sessionStorage.setItem("token", res.data.token);
            toast.success("Account created successfully");
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message);
        }
        finally {
            set({ isSigningUp: false });
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data.user });
            sessionStorage.setItem("token", res.data.token);
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },
    adminLogin: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/adminlogin", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },
    logout: () => {
        set({ isLoggingOut: true });
        try {
            const res = axiosInstance.post("/auth/logout");
            sessionStorage.removeItem("token");
            toast.success("Logged out successfully!");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingOut: false });
        }
    },
}))