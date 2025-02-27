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
        password: {
            type: String,
            required: true,
            trim: true,
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
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        branch: {
            type: String,
            uppercase: true,
        }
    },
);

export const Admin = mongoose.model("Admin", adminSchema);
export const AdminDetail = mongoose.model("AdminDetail", adminDetailSchema);