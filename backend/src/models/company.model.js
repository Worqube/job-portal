import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
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

const companyDetailSchema = new mongoose.Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
        company_name: {
            type: String,
            trim: true,
        },
    },
);

export const Company = mongoose.model("Company", companySchema);
export const CompanyDetail = mongoose.model("CompanyDetail", companyDetailSchema);