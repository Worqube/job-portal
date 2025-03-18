import React, { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";

const Profile = () => {
  const { userData, profileData, isLoading } = useAuthStore();

  useEffect(() => {
    profileData();
  }, []);

  if (isLoading) {
    return (
      <p className="text-center mt-10 text-gray-600">Loading profile...</p>
    );
  }

  if (!userData) {
    return (
      <p className="text-center mt-10 text-gray-600">
        No profile data available.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 relative">
        {/* Profile Picture & Name */}
        <div className="flex flex-col items-center -mt-16">
          <img
            src={userData.profilePic || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white shadow-md"
          />
          <h3 className="text-2xl font-semibold text-gray-800 mt-4">
            {userData.name}
          </h3>
          <p className="text-gray-500">{userData.email}</p>
        </div>

        {/* User Info Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-gray-700">Gender</h4>
            <p className="text-gray-600 capitalize">{userData.gender}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-gray-700">Bio</h4>
            <p className="text-gray-600">
              {userData.bio || "No bio available."}
            </p>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-100 p-4 rounded-lg shadow-md text-center">
            <h4 className="text-lg font-semibold text-gray-700">Projects</h4>
            <p className="text-gray-600">
              {userData.projects || "No projects listed."}
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md text-center">
            <h4 className="text-lg font-semibold text-gray-700">Skills</h4>
            <p className="text-gray-600">
              {userData.skills || "No skills added."}
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md text-center">
            <h4 className="text-lg font-semibold text-gray-700">Experience</h4>
            <p className="text-gray-600">
              {userData.experience || "No experience added."}
            </p>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="mt-6 flex justify-end">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
