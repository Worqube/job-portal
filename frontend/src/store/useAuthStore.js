import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useAuthStore = create(
    persist(
        (set) => ({
            authUser: null,
            userData: null,
            isSigningUp: false,
            isCheckingAuth: true,
            isLoggingIn: false,
            isLoggingOut: false,
            isLoading: false,
            isApplying: false,

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
                    console.error(error.response ? error.response.data : error.message);
                    toast.error(error.response.data.message);
                } finally {
                    set({ isSigningUp: false });
                }
            },
            login: async (data) => {
                set({ isLoggingIn: true });
                try {
                    const res = await axiosInstance.post('/auth/login',
                        data,
                        // { withCredentials: true }
                    );
                    set({ authUser: res.data });
                    sessionStorage.setItem("user", JSON.stringify(res.data));
                    const user = JSON.parse(sessionStorage.getItem('user'));
                    await useAuthStore.getState().profileData(user.reg_id);
                    toast.success('Logged in successfully');
                } catch (error) {
                    set({ authUser: null });
                    console.error("Login Error: ", error.response ? error.response.data : error.message);
                    toast.error('Error in useAuthStore login function');
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
                    set({ authUser: null });
                    toast.error("Error in controller");
                } finally {
                    set({ isLoggingIn: false });
                }
            },
            profileData: async (data) => {
                set({ isLoading: true })
                const regId = data;
                try {
                    const user = JSON.parse(sessionStorage.getItem('user'));
                    const res = await axiosInstance.post('/users/loadData', { reg_id: user.reg_id || regId }, { withCredentials: true });
                    set({ userData: res.data });
                    sessionStorage.setItem("userData", JSON.stringify(res.data));
                } catch (error) {
                    console.error("Error fetching profile:", error);
                } finally {
                    set({ isLoading: false });
                }
            },
            editProfile: async (data) => {
                set({ isLoading: true });
                const user = JSON.parse(sessionStorage.getItem('user'));
                try {
                    const res = await axiosInstance.put(`/users/editProfile/${user.reg_id}`, data, { withCredentials: true });
                    set({ userData: res.data });
                    sessionStorage.setItem("userData", JSON.stringify(res.data));
                    toast.success("Data updated successfully");
                } catch (error) {
                    console.error("Error fetching profile:", error);
                    toast.error("Error in controller");
                } finally {
                    set({ isLoading: false });
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
            applyJob: async (data) => {
                set({ isApplying: true });
                const userData = JSON.parse(sessionStorage.getItem("userData"));
                try {
                    if (userData.appliedJobs.includes(data)) return;

                    const res = await axiosInstance.post('/jobs/apply', { jobId: data }, { withCredentials: true });
                    res.status(200).send(res.data);
                } catch (error) {
                    console.error("Error applying job:", error.response ? error.response.data : error.message);
                    res.status(500).json({ message: "Internal Server Error" });
                }
            },
        }),
        {
            name: 'auth-storage', // unique name
            getStorage: () => sessionStorage, // use sessionStorage
        }
    )
);
