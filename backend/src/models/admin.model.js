import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true
        },
        email: {
            type: email,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
            default: username,
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

const adminDetailSchema = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
        name: {
            type: String,
            trim: true,
        },
        branch: {
            type: String,
            uppercase: true,
            required: true,
        }
    },
);

export const Admin = mongoose.model("Admin", adminSchema);
export const AdminDetail = mongoose.model("AdminDetail", adminDetailSchema);