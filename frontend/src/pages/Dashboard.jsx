import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Briefcase, Users, FileText } from "lucide-react";

const jobData = [
  { name: "Jan", jobs: 120 },
  { name: "Feb", jobs: 98 },
  { name: "Mar", jobs: 140 },
  { name: "Apr", jobs: 115 },
  { name: "May", jobs: 180 },
  { name: "Jun", jobs: 160 },
];

const Dashboard = () => {
  const { logout } = useAuthStore();
  const handleLogout = async (e) => {
    e.preventDefault();
    logout();
    window.location.reload();
  };
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white p-6 space-y-6">
        <h2 className="text-xl font-bold">Job Portal</h2>
        <nav>
          <ul className="space-y-4">
            <li className="cursor-pointer hover:text-gray-300">Dashboard</li>
            <li className="cursor-pointer hover:text-gray-300">Job Listings</li>
            <li className="cursor-pointer hover:text-gray-300">Applicants</li>
            <li className="cursor-pointer hover:text-gray-300">Settings</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800">
              Post a Job
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-3 gap-6">
          <div className="p-4 flex items-center space-x-4 bg-white shadow-md rounded-lg">
            <Briefcase className="text-blue-600" size={32} />
            <div>
              <h3 className="text-lg font-semibold">Total Jobs</h3>
              <p className="text-gray-600">120</p>
            </div>
          </div>
          <div className="p-4 flex items-center space-x-4 bg-white shadow-md rounded-lg">
            <Users className="text-green-600" size={32} />
            <div>
              <h3 className="text-lg font-semibold">Applicants</h3>
              <p className="text-gray-600">540</p>
            </div>
          </div>
          <div className="p-4 flex items-center space-x-4 bg-white shadow-md rounded-lg">
            <FileText className="text-yellow-600" size={32} />
            <div>
              <h3 className="text-lg font-semibold">Interviews Scheduled</h3>
              <p className="text-gray-600">30</p>
            </div>
          </div>
        </div>

        {/* Job Statistics Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-lg font-bold mb-4">Job Postings Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={jobData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="jobs" fill="#4F46E5" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
