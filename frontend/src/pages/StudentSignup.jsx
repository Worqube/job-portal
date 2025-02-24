import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import {
  User,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";

const StudentSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    reg_id: "",
    email: "",
    password: "",
  });
  const { signup, isSigningUp } = useAuthStore();
  const validateForm = () => {
    // validate the form
    if (!formData.reg_id.trim()) return toast.error("Reg Id is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password.trim()) return toast.error("Password is required");
    if (formData.password.length < 8)
      return toast.error("Password must be at least 8 characters");

    return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();
    if (success === true) signup(formData);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Register
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <div className="flex items-center gap-2 py-2">
              <User className="size-5" />
              <label className="block font-bold text-xl text-gray-700">
                Registration Id
              </label>
            </div>
            <input
              type="text"
              value={formData.reg_id}
              autoComplete="true"
              className="w-full text-lg px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your Registration Id"
              onChange={(e) =>
                setFormData({ ...formData, reg_id: e.target.value })
              }
            />
          </div>
          <div>
            <div className="flex items-center gap-2 py-2">
              <Mail className="size-5" />
              <label
                htmlFor="email"
                className="block font-bold text-xl text-gray-700"
              >
                Email
              </label>
            </div>
            <input
              type="text"
              value={formData.email}
              autoComplete="true"
              className="w-full text-lg px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <div className="flex items-center gap-2 py-2">
              <Lock className="size-5" />
              <label
                htmlFor="email"
                className="block text-xl font-bold text-gray-700"
              >
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
              Sign up
            </button>
          </div>
        </form>
        <p className="text-md text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default StudentSignup;
