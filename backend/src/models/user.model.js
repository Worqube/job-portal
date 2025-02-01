import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        profilepic: {
            type: String,
        },
    },
    { timestamps: true }
);

const detailSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        phone: {
            type: Number,
            minlength: 10,
            trim: true,
        },
        gender: {
            type: String,
        },
        address: {
            type: String,
            trim: true,
        },
        postal_code: {
            type: Number,
            trim: true,
        },
    }
);

export const User = mongoose.model("User", userSchema);
export const Detail = mongoose.model("Detail", detailSchema);