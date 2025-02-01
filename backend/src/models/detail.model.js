import mongoose from "mongoose";
import User from "./user.model.js";

const userDetailSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
        },
        dob: {
            type: Date,
            required: true,
        },
        gender: {
            type: String,
        },
        address: {
            type: String,
        },
        postal_code: {
            type: Number,
        },
        resume: {
            type: Blob,
        }
    },
);

const Detail = mongoose.model("Detail", userDetailSchema);

export default Detail;