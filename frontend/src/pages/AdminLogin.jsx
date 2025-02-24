import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { adminLogin, isLoggingIn } = useAuthStore();
  const handleSubmit = async (e) => {
    e.preventDefault();
    adminLogin(formData);
  };
  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <div className="flex items-center gap-2 py-2">
            <User className="size-5" />
            <label className="block font-bold text-xl text-gray-700">
              Username
            </label>
          </div>
          <input
            type="text"
            value={formData.username}
            autoComplete="true"
            className="w-full text-lg px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your Username"
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        </div>
        <div>
          <div className="flex items-center gap-2 py-2">
            <Lock className="size-5" />
            <label className="block text-xl font-bold text-gray-700">
              Password
            </label>
          </div>
          <div className="flex items-center justify-between gap-3">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="true"
              className="w-full text-lg px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Eye className="size-5" />
              ) : (
                <EyeOff className="size-5" />
              )}
            </button>
          </div>
        </div>
        <div className="pt-4">
          <button
            type="submit"
            className="w-full px-4 py-2 text-xl text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Sign in
          </button>
        </div>
      </form>
      <div className="text-md text-center text-gray-600">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </div>
    </>
  );
};

export default AdminLogin;
