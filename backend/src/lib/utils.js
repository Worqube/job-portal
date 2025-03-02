import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1d", // Token valid for 1 day
    });

    res.cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true, // Prevent client-side access
        secure: true, // Secure in production
        sameSite: "strict", // Allows cross-site requests
    });

    return token;
};
