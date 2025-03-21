import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [expandedJob, setExpandedJob] = useState(null);
  const [user, setUser] = useState({ appliedJobs: [] });

  useEffect(() => {
    fetch("http://localhost:6060/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data));
  }, []);

  const applyJob = useAuthStore();

  return (
    <div className="relative p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      {jobs.map((job) => (
        <div
          key={job._id}
          className={`border rounded-lg p-4 shadow-lg bg-white cursor-pointer transition-all duration-400 ${
            expandedJob && expandedJob !== job._id ? "blur-sm" : ""
          }`}
          onClick={() =>
            setExpandedJob(expandedJob === job._id ? null : job._id)
          }
        >
          <div className="flex items-center gap-3">
            <img
              src={job.logo}
              alt={job.company}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="text-lg font-semibold">{job.company}</h3>
              <p className="text-gray-500">{job.role}</p>
              <p className="text-green-600 font-medium">
                {job.salary ? `$${job.salary}` : "Unpaid"}
              </p>
            </div>
          </div>
          {expandedJob === job._id && (
            <div className="fixed inset-0 flex justify-center items-center bg-black/5 z-50">
              <div className="relative w-96 h-96 bg-white shadow-xl rounded-lg p-6 flex flex-col">
                <button
                  className="absolute top-2 right-2 bg-gray-200 p-2 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedJob(null);
                  }}
                >
                  ✖
                </button>
                <div className="flex items-center gap-3">
                  <img
                    src={job.logo}
                    alt={job.company}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{job.company}</h3>
                    <p className="text-gray-500">{job.role}</p>
                    <p className="text-green-600 font-medium">
                      {job.salary ? `$${job.salary}` : "Unpaid"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 border-t pt-2">
                  <p className="text-sm text-gray-700">{job.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {job.location} ({job.type})
                  </p>
                  <button
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      applyJob(job._id);
                    }}
                  >
                    {user.appliedJobs.includes(job._id) ? "Applied" : "Apply"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
