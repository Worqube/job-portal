import { Admin, AdminDetail } from "../models/admin.model.js";
import bcrypt from 'bcryptjs';

export const adminProfile = async (req, res) => {
    const username = req.query.username;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(404).json({ message: "Admin not found" });
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error);
    }
};

export const adminDetails = async (req, res) => {
    const username = req.query.username;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(404).json({ message: "Admin not found" });
        const details = await AdminDetail.findOne({ adminId: admin._id });
        if (!details) return res.status(404).json({ message: "Details not found" });
        res.status(200).send(details);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const addAdminDetails = async (req, res) => {
    const username = req.query.username;
    const { password, phone, branch } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and Password are required" });

    try {
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(404).json({ message: "User not found" });
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) return res.status(403).json({ message: "Incorrect password" });

        let adminDetails = await AdminDetail.findOne({ adminId: admin._id });

        if (adminDetails) {
            adminDetails.phone = phone;
            adminDetails.branch = branch;
            await adminDetails.save();
            res.status(200).send(adminDetails);
        } else {
            adminDetails = new AdminDetail({
                adminId: admin._id,
                phone,
                branch,
            });
            await adminDetails.save();
            res.status(201).send(adminDetails);
        }
    } catch (error) {
        res.status(500).send(error);
    }
};