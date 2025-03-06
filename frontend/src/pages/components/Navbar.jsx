import React from "react";
import { useAuthStore } from "../../store/useAuthStore";
import NavHeader from "../../components/nav-header.jsx";
import { Link } from "react-router-dom";
import logo from "../../assets/logo-worqube.jpg";
import { LogOut, MessagesSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  return (
    <div className="navbar h-fit">
      <div className="flex items-center justify-between">
        <img className="size-30" src={logo}></img>
        <NavHeader />
        <Link to="/profile">
          <button className="font-semibold text-lg w-20 h-12 rounded-lg border-2 border-black bg-white p-2 mr-10 hover:bg-black hover:text-white transition-all duration-100">
            Profile
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
