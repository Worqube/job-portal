import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 letters" });
        }

        let user = await User.findOne({ email: email });
        if (user) return res.status(400).json({ message: "Email already exist" });

        const salt = await bcrypt.genSalt(10);
        const hashedPW = await bcrypt.hash(password, salt);

        const newUser = new User({
            username: username,
            email: email,
            password: hashedPW,
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).send(newUser)
        } else {
            res.status(400).json({ message: "Invalid User Data" })
        }

    } catch (error) {
        res.status(500).send(error)
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "All fields are required" });

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found" });
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) return res.status(400).json({ message: "Password is incorrect" });

        generateToken(user._id, res);
        res.status(200).send(user);
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