import bcrypt from "bcryptjs";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { Detail, User } from "../models/user.model.js";
import { Admin, AdminDetail } from "../models/admin.model.js";
import { generateToken } from "../lib/utils.js";

async function sendEmail(user) {
    const token = crypto.randomBytes(32).toString('hex');
    user.verificationToken = token;
    await user.save();

    const verificationURL = `https://job-portal-6nsa.onrender.com/verify/${user.reg_id}/${token}`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'worqubeofficial@gmail.com',
            pass: 'WorkCube#123'
        },
    });

    const mailOptions = {
        from: 'worqubeofficial@gmail.com',
        to: user.email,
        subject: 'Verify your email',
        text: `Please click on the link to verify your email: ${verificationURL}`,
    };

    await transporter.sendMail(mailOptions);
};

export const asignup = async (req, res) => {
    const { username, password } = req.body;
    try {
        let admin = await Admin.findOne({ username });
        if (admin) return res.status(400).json({ message: "Username already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPW = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({
            username: username,
            password: hashedPW,
        });

        if (newAdmin) {
            generateToken(newAdmin._id, res);
            await newAdmin.save();
            const newAdminDetails = new AdminDetail({
                adminId: newAdmin._id,
            });
            await newAdminDetails.save();
            console.log(newAdmin, newAdminDetails);
            res.status(201).json({ newAdmin });
        } else {
            res.status(400).json({ message: "Failed to create new admin" });
        }
    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json(error.message);
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

        user = await User.findOne({ email: email });
        if (user) return res.status(400).json({ message: "Email already exist" });

        const salt = await bcrypt.genSalt(10);
        const hashedPW = await bcrypt.hash(password, salt);

        const newUser = new User({
            reg_id: reg_id,
            email: email,
            password: hashedPW,
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            const newDetails = new Detail({
                userId: newUser._id,
            });
            await newDetails.save();
            await sendEmail(newUser);
            res.status(201).json({ newUser });
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

        if (user.verified) {
            generateToken(user._id, res);
            res.json({
                _id: user._id,
                reg_id: user.reg_id,
                email: user.email,
            });
        } else {
            const link = `https://job-portal-6nsa/verify/${user.reg_id}/${user.verificationToken}`;
            res.json({ message: `Follow this link to verify ${link}` });
        }
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

        generateToken(admin._id, res);
        res.json({
            _id: admin._id,
            username: admin.username,
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

export const verify = async (req, res, next) => {
    const { reg_id, token } = req.params;
    try {
        const user = await User.findOne({ reg_id });
        if (!user) return res.status(400).json({ message: "Invalid link" });
        if (user.verificationToken !== token) return res.status(400).send("Invalid or expired token");
        user.verified = true;
        user.verificationToken = undefined;
        await user.save();
        req.user = user;
        next();
    } catch (error) {
        res.status(500).send("Server error");
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("token", "", {
            maxAge: 0,
            domain: 'job-portal-6nsa.onrender.com',
            path: '/auth/check',
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).send(error);
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error);
        res.status(500).send(error.message);
    }
};