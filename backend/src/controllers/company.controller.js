import { Company, CompanyDetail } from '../models/company.model';
import bcrypt from 'bcryptjs';

export const companyProfile = async (req, res) => {
    const username = req.query.username;
    try {
        const company = await Company.findOne({ username });
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        res.send(company);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const userDetails = async (req, res) => {
    const username = req.query.username;
    try {
        const company = await Company.findOne({ username });
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        const details = await CompanyDetail.findOne({ companyId: company._id });
        if (!details) return res.status(404).json({ message: "Details not found" });
    } catch (error) {
        res.status(500).send(error);
    }
};

export const updateCompanyDetails = async (req, res) => {
    const username = req.query.username;
    const { password, company_name } = req.body;

    if (!username || !password) return res.status(400).json({ message: "Username and Password is required" });

    try {
        const company = await Company.findOne({ username });
        if (!company) return res.status(404).json({ message: "Company not found" });

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) return res.status(403).json({ message: "Invalid password" });

        let companyDetails = await CompanyDetail.findOne({ companyId: company._id });

        if (companyDetails) {
            if (company_name) companyDetails.company_name = company_name;
            //   if (fullname) companyDetails.fullname = fullname;
            //   if (profilepic) companyDetails.profilepic = profilepic;
            //   if (address) companyDetails.address = address;
            //   if (gender) companyDetails.gender = gender;
            //   if (phone) companyDetails.phone = phone;
            //   if (postal_code) companyDetails.postal_code = postal_code;
            await companyDetails.save();
            res.status(200).send(companyDetails);
        } else {
            companyDetails = new CompanyDetail({
                companyId: company._id,
                company_name
            });
            await companyDetails.save();
            res.status(201).send(companyDetails);
        }
    } catch (error) {
        res.status(500).send(error);
    }
};