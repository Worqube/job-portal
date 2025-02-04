import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
    const { email, password } = req.body;
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