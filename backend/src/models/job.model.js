import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    jobId: {
        type: String,
        required: true,
        unique: true,
    },
    company: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
    },
    role: {
        type: String,
        required: true,
    },
    salary: {
        type: String,
    },
    location: {
        type: String,
    },
    description: {
        type: String,
    },
    applicants: [{
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    }],
});

export const Job = mongoose.model("Job", jobSchema);