import React from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const location = useLocation(); // Get the current route

  // Ensure user data is retrieved properly
  const storedUser = sessionStorage.getItem("user");
  const loggedIn = authUser || storedUser;

  // Determine button text and link based on current page
  const isLoginPage = location.pathname === "/login";
  const isHome = location.pathname === "/";
  const buttonText = isLoginPage ? "Sign Up" : "Login";
  const buttonLink = isLoginPage ? "/signup" : "/login";

  return (
    <div className="navbar h-fit">
      <nav className="flex justify-between items-center py-4 px-8 bg-white shadow-md">
        <div className="text-xl font-bold">Worqube</div>

        {/* Navigation Links */}
        <div className="space-x-8">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          {loggedIn && (
            <Link to="/jobs" className="text-gray-600 hover:text-gray-900">
              Jobs
            </Link>
          )}
          {loggedIn && (
            <Link to="/companies" className="text-gray-600 hover:text-gray-900">
              Companies
            </Link>
          )}
          <Link to="/profile" className="text-gray-600 hover:text-gray-900">
            Profile
          </Link>
        </div>

        {/* Auth Button */}
        {loggedIn ? (
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        ) : !isHome ? (
          <Link to={buttonLink}>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {buttonText}
            </button>
          </Link>
        ) : (
          <></>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
