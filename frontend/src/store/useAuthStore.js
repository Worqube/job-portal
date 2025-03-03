import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useAuthStore = create(
    persist(
        (set) => ({
            authUser: null,
            isSigningUp: false,
            isCheckingAuth: true,
            isLoggingIn: false,
            isLoggingOut: false,

            checkAuth: async () => {
                const user = sessionStorage.getItem('user');
                try {
                    if (user) {
                        set({ authUser: JSON.parse(user) });
                    } else {
                        const res = await axiosInstance.get('/auth/check', { withCredentials: true });
                        set({ authUser: res.data });
                    }
                } catch (error) {
                    set({ authUser: null });
                } finally {
                    set({ isCheckingAuth: false });
                }
            },
            signup: async (data) => {
                set({ isSigningUp: true });
                try {
                    const res = await axiosInstance.post('/auth/signup', data, { withCredentials: true });
                    set({ authUser: res.data });
                    sessionStorage.setItem("user", JSON.stringify(res.data));
                    toast.success('Account created successfully');
                } catch (error) {
                    console.log(error);
                    toast.error(error.response.data.message);
                } finally {
                    set({ isSigningUp: false });
                }
            },
            login: async (data) => {
                set({ isLoggingIn: true });
                try {
                    const res = await axiosInstance.post('/auth/login', data, { withCredentials: true });
                    set({ authUser: res.data });
                    sessionStorage.setItem("user", JSON.stringify(res.data));
                    toast.success('Logged in successfully');
                } catch (error) {
                    set({ authUser: null });
                    toast.error('Error in controller');
                } finally {
                    set({ isLoggingIn: false });
                }
            },
            adminLogin: async (data) => {
                set({ isLoggingIn: true });
                try {
                    const res = await axiosInstance.post('/auth/adminlogin', data, { withCredentials: true });
                    set({ authUser: res.data });
                    sessionStorage.setItem("user", JSON.stringify(res.data));
                    toast.success('Logged in successfully');
                } catch (error) {
                    toast.error(error);
                } finally {
                    set({ isLoggingIn: false });
                }
            },
            logout: async () => {
                set({ isLoggingOut: true });
                const user = sessionStorage.getItem('user');
                try {
                    if (user) {
                        sessionStorage.removeItem('user');
                        set({ authUser: null })
                    } else {
                        await axiosInstance.post('/auth/logout');
                        set({ authUser: null });
                        toast.success('Logged out successfully!');
                    }
                } catch (error) {
                    toast.error(error.response.data.message);
                } finally {
                    set({ isLoggingOut: false });
                }
            },
        }),
        {
            name: 'auth-storage', // unique name
            getStorage: () => sessionStorage, // use sessionStorage
        }
    )
);
