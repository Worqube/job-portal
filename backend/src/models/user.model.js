import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
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
        fullname: {
            type: String,
            trim: true,
        },
        profilepic: {
            type: String,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
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