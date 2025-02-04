import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
    const { email, password } = req.body;
}