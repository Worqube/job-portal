import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import StudentSignup from "./pages/StudentSignup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  return (
    <div className="items-center">
      <Routes>
        <Route
          path="/"
          element={authUser ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <StudentSignup /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
