import React from "react";
import { useAuthStore } from "../../store/useAuthStore";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  return (
    <div className="navbar h-fit">
      <nav className="flex justify-between items-center py-4 px-8 bg-white shadow-md">
        <div className="text-xl font-bold">TNP Nexus</div>
        <div className="space-x-8">
          <a href="#" className="text-gray-600 hover:text-gray-900">
            Home
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            Jobs
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            Companies
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            About
          </a>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Login
        </button>
      </nav>
    </div>
  );
};

export default Navbar;
