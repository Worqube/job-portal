import { Admin } from "../models/admin.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import crypto from 'crypto';

export const jobDisplay = async (req, res) => {
    const jobs = await Job.find();
    res.json(jobs);
};

export const jobApply = async (req, res) => {
    const { userId, jobId } = req.body;

    const user = await User.findById(userId) || new User({ userId, appliedJobs: [] });
    const job = await Job.findById(jobId);

    if (!job) return res.status(404).json({ message: "Job not found" });
    if (user.appliedJobs.includes(jobId)) return res.status(400).json({ message: "You have already applied for this job" });

    user.appliedJobs.push(jobId);
    job.applicants.push(user._id);

    await user.save();
    await job.save();
    res.status(200).json({ message: "Application Successful" });
};

export const jobAdd = async (req, res) => {
    const { adminId, company, logo, role, salary, description, location } = req.body;

    const user = await User.findOne({ reg_id: adminId });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === 'user') return res.status(401).json({ message: "Not an admin" });

    const id = crypto.randomBytes(10).toString('hex');
    const job = new Job({
        jobId: id,
        company: company,
        logo: logo,
        location: location,
        role: role,
        salary: salary,
        description: description,
        applicants: [],
    });
    await job.save();
    res.status(200).json({ message: "Job Added Successfully" });
}