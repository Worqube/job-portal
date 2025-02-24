import React, { useState } from "react";
import StudentLogin from "./StudentLogin";
import AdminLogin from "./AdminLogin";

const Login = () => {
  const [lit, setLit] = useState("Student");
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>
        <div className="relative flex space-x-2 border-[3px] border-blue-500 rounded-xl select-none overflow-hidden">
          {/* Left Section (Student) */}
          <div
            className={`flex-1 p-2 text-center cursor-pointer transition-all duration-300 ${
              lit === "Student"
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }`}
            onClick={() => setLit("Student")}
          >
            Student
          </div>

          {/* Right Section (Admin) */}
          <div
            className={`flex-1 p-2 text-center cursor-pointer transition-all duration-300 ${
              lit === "Admin" ? "bg-blue-500 text-white" : "bg-white text-black"
            }`}
            onClick={() => setLit("Admin")}
          >
            Admin
          </div>
        </div>
        {lit === "Student" ? <StudentLogin /> : <AdminLogin />}
      </div>
    </div>
  );
};

export default Login;
