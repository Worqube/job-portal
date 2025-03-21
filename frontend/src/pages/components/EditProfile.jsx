import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";

const EditProfile = () => {
  const { userData, editProfile } = useAuthStore();
  const [formData, setFormData] = useState(userData || {});
  const [profilePic, setProfilePic] = useState(userData.profilepic || "");
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProfilePic(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    // Append text fields
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    // Append file if selected
    if (file) {
      formDataToSend.append("profilepic", file);
    }

    await editProfile(formDataToSend);
    console.log("Profile updated:", formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-center">Edit Profile</h2>
        <form
          onSubmit={handleSubmit}
          className="mt-4"
          encType="multipart/form-data"
        >
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center mb-4">
            <img
              src={profilePic || "https://via.placeholder.com/150"}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full border shadow-md object-cover mb-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm"
            />
          </div>

          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={formData.fullname || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
          />
          <input
            type="text"
            name="gender"
            placeholder="Gender"
            value={formData.gender || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
          />
          <input
            type="text"
            name="postal_code"
            placeholder="Postal Code"
            value={formData.postal_code || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
          />
          <input
            type="text"
            name="branch"
            placeholder="Branch"
            value={formData.branch || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3 uppercase"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
