import React from "react";
import { useAuthStore } from "../store/useAuthStore";

const Dashboard = () => {
  const { logout } = useAuthStore();
  const handleLogout = async (e) => {
    e.preventDefault();
    logout();
    window.location.reload();
  };
  return (
    <div>
      <h1>Dashboard</h1>
      <p className="mt-10 text-center text-sm/6 text-gray-500">
        <button
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handleLogout}
        >
          Logout
        </button>
      </p>
    </div>
  );
};

export default Dashboard;
