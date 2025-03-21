import { Detail, User } from "../models/user.model.js";

export const adminProfile = async (req, res) => {
    const username = req.query.username;
    try {
        const user = await User.findOne({ reg_id: username });
        if (!user) return res.status(404).json({ message: "Admin not found" });
        if (user.role === 'user') return res.status(400).json({ message: "Not an admin" });
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const adminDetails = async (req, res) => {
    const username = req.query.username;
    try {
        const user = await User.findOne({ reg_id: username });
        if (!user) return res.status(404).json({ message: "Admin not found" });
        if (user.role === 'user') return res.status(400).json({ message: "Not an admin" });
        const details = await Detail.findOne({ userId: user._id });
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
        const user = await User.findOne({ reg_id: username });
        if (!user) return res.status(404).json({ message: "Admin not found" });
        if (user.role === 'user') return res.status(400).json({ message: "Not an Admin" });

        let adminDetails = await Detail.findOne({ userId: user._id });

        if (adminDetails) {
            adminDetails.phone = phone;
            adminDetails.branch = branch;
            await adminDetails.save();
            res.status(200).send(adminDetails);
        } else {
            adminDetails = new Detail({
                userId: user._id,
                phone: phone,
                branch: branch,
            });
            await adminDetails.save();
            res.status(201).send(adminDetails);
        }
    } catch (error) {
        res.status(500).send(error);
    }
};