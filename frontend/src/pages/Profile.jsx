import React from "react";
import { Link } from "react-router-dom";

const user = JSON.parse(sessionStorage.getItem("user"));
const userData = JSON.parse(sessionStorage.getItem("userData"));

const Profile = () => {
  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
        {/* Profile Header */}
        <div className="flex items-center gap-6">
          <img
            src={userData.profilepic || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-24 h-24 rounded-full border shadow-md object-cover"
          />
          <div>
            <h2 className="text-2xl font-semibold">
              {userData.fullname || "User"}
            </h2>
            <p className="text-gray-500">
              {userData.branch || "Not specified"}
            </p>
            <p className="text-gray-600">
              {user.email || "No email available"}
            </p>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="mt-6 flex justify-center">
          <Link to={`/users/editProfile/${user.reg_id}`}>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
              Edit Profile
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
