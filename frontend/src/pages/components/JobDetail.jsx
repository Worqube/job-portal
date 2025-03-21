import { axiosInstance } from "@/lib/axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function JobDetails() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJobDetails() {
      try {
        const response = await axiosInstance.get(`/jobs/${jobId}`); // Replace with actual backend URL
        if (!response.ok) throw new Error("Failed to fetch job details");
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchJobDetails();
  }, [jobId]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <div className="flex items-center">
        <img
          src={job.companyLogo}
          alt="Company Logo"
          className="w-20 h-20 mr-4"
        />
        <div>
          <h1 className="text-2xl font-bold">{job.companyName}</h1>
          <p className="text-gray-600">{job.jobTitle}</p>
        </div>
      </div>
      <p className="text-lg font-bold text-blue-600 mt-4">
        {job.salary ? `$${job.salary} / year` : "Unpaid"}
      </p>
      <h2 className="text-xl font-semibold mt-6">Job Description</h2>
      <p className="text-gray-700 mt-2">{job.description}</p>
      <h2 className="text-xl font-semibold mt-6">Requirements</h2>
      <ul className="list-disc ml-6 text-gray-700">
        {job.requirements.map((req, index) => (
          <li key={index}>{req}</li>
        ))}
      </ul>
    </div>
  );
}
