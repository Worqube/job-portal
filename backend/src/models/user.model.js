import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        reg_id: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        email: {
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        role: {
            type: String,
            default: "user",
            required: true,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
        }

    },
    { timestamps: true },
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
            },
        },
    },
);

const detailSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        fullname: {
            type: String,
            trim: true,
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
        branch: {
            type: String,
            trim: true,
            uppercase: true,
        },
        appliedJobs: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'Job'
        }],
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
export const Detail = mongoose.model("Detail", detailSchema);