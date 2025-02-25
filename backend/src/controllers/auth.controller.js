import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.model.js";
import { generateToken } from "../lib/utils.js";

export const asignup = async (req, res) => {
    const { username, password } = req.body;
    try {
        let admin = await Admin.findOne({ username });
        if (admin) return res.status(400).json({ message: "Username already exists" });
        admin = null;

        const salt = await bcrypt.genSalt(10);
        const hashedPW = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({
            username: username,
            password: hashedPW,
        });

        if (newAdmin) {
            const token = generateToken(newAdmin._id);
            await newAdmin.save();
            res.status(201).send(newAdmin).json({ token, userId: newAdmin._id });
        } else {
            res.status(400).json({ message: "Failed to create new admin" });
        }
    } catch (error) {
        res.status(500).send(error);
    }
}
export const signup = async (req, res) => {
    const { reg_id, email, password } = req.body;
    try {
        if (!reg_id || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 letters" });
        }

        let user = await User.findOne({ reg_id: reg_id });
        if (user) return res.status(400).json({ message: "Reg Id already exists" });
        user = null

        user = await User.findOne({ email: email });
        if (user) return res.status(400).json({ message: "Email already exist" });

        const salt = await bcrypt.genSalt(10);
        const hashedPW = await bcrypt.hash(password, salt);

        const newUser = new User({
            reg_id: reg_id,
            email: email,
            password: hashedPW,
        });

        await newUser.save();

        if (newUser) {
            const token = generateToken(newUser._id);
            await newUser.save();
            res.status(201).json({ token, userId: newUser._id });
        } else {
            res.status(400).json({ message: "Invalid User Data" })
        }

    } catch (error) {
        res.status(500).send(error)
    }
};

export const login = async (req, res) => {
    const { reg_id, password } = req.body;
    if (!reg_id || !password) return res.status(400).json({ message: "All fields are required" });

    try {
        const user = await User.findOne({ reg_id });
        if (!user) return res.status(404).json({ message: "User not found" });
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) return res.status(400).json({ message: "Password is incorrect" });

        const token = generateToken(user._id);
        res.status(200).json({ token, userId: user._id });
    } catch (error) {
        res.status(500).send(error);
    }
};

export const alogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "All fields are required" });

    try {
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(404).json({ message: "Admin not found" });
        const isPassword = await bcrypt.compare(password, admin.password);
        if (!isPassword) return res.status(400).json({ message: "Password is incorrect" });

        const token = generateToken(admin._id, res);
        res.status(200).send(admin).json({ token, userId: admin._id });
    } catch (error) {
        res.status(500).send(error);
    }
};

export const logout = (req, res) => {
    try {
        if (!res.cookie("token")) return res.status(404).json({ message: "Cookie not found!" });
        res.cookie("token", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).send(error);
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).send(req.user);
    } catch (error) {
        res.status(500).send(error.message);
    }
};