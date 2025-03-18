import React from "react";
import { useAuthStore } from "../../store/useAuthStore";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  // Ensure user data is retrieved properly
  const storedUser = sessionStorage.getItem("user");
  const loggedIn = authUser || storedUser;

  return (
    <div className="navbar h-fit">
      <nav className="flex justify-between items-center py-4 px-8 bg-white shadow-md">
        <div className="text-xl font-bold">TNP Nexus</div>

        {/* Navigation Links */}
        <div className="space-x-8">
          <a href="#" className="text-gray-600 hover:text-gray-900">
            Home
          </a>
          {loggedIn && (
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Jobs
            </a>
          )}
          {loggedIn && (
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Companies
            </a>
          )}
          <a href="#" className="text-gray-600 hover:text-gray-900">
            About
          </a>
        </div>

        {/* Auth Button */}
        {loggedIn ? (
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        ) : (
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Login
          </button>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
