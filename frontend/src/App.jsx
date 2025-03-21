import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import StudentSignup from "./pages/StudentSignup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import Navbar from "./pages/components/Navbar";
import Profile from "./pages/Profile";
import Verify from "./pages/components/Verify";
import HomePage from "./pages/components/HomePage";
import JobDetails from "./pages/components/JobDetail";
import EditProfile from "./pages/components/EditProfile";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  const user = JSON.parse(sessionStorage.getItem("user")) || {};

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  return (
    <div className="items-center">
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <Dashboard /> : <HomePage />} />
        <Route
          path="/signup"
          element={
            authUser ? (
              authUser.verified ? (
                <Navigate to="/" />
              ) : (
                <Verify />
              )
            ) : (
              <StudentSignup />
            )
          }
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/jobs/:jobId" element={<JobDetails />} />
        <Route
          path={`/users/editProfile/${user.reg_id}`}
          element={<EditProfile />}
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
