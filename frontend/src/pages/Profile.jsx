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
            <h2 className="text-2xl font-semibold">{userData.fullname}</h2>
            <p className="text-gray-500">{userData.branch}</p>
            <p className="text-gray-600">{user.email}</p>
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

        {/* Skills Section */}
        {/* <div className="mt-6">
          <h3 className="text-xl font-semibold">Skills</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {userData.skills && userData.skills.length > 0 ? (
              userData.skills.map((skill, index) => (
                <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No skills added.</p>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Profile;
