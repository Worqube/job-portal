import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isCheckingAuth: true,
    isLoggingIn: false,
    isLoggingOut: false,

    checkAuth: async () => {
        const loggedUser = sessionStorage.getItem('user');
        const loggedAdmin = sessionStorage.getItem('admin');
        if (!loggedUser || !loggedAdmin) {
            try {
                const res = await axiosInstance.get('/auth/check', { withCredentials: true });
                set({ authUser: res.data });
            } catch (error) {
                set({ authUser: null });
            } finally {
                set({ isCheckingAuth: false })
            }
        }
        else {
            set({ authUser: JSON.parse(loggedUser) || JSON.parse(loggedAdmin), isCheckingAuth: false });
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/auth/signup', data, { withCredentials: true });
            set({ authUser: res.data });
            sessionStorage.setItem('user', JSON.stringify(res.data));
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
            const res = await axiosInstance.post("/auth/login", data, {
                withCredentials: true,
            });
            set({ authUser: res.data });
            sessionStorage.setItem('user', JSON.stringify(res.data));
            toast.success("Logged in successfully");
        } catch (error) {
            set({ authUser: null })
            toast.error("Error in controller");
        } finally {
            set({ isLoggingIn: false });
        }
    },
    adminLogin: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/adminlogin", data, { withCredentials: true });
            set({ authUser: res.data });
            sessionStorage.setItem('admin', JSON.stringify(res.data));
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },
    logout: async () => {
        set({ isLoggingOut: true });
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('admin');
            toast.success("Logged out successfully!");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingOut: false });
        }
    },
}))