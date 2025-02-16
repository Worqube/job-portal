import { User, Detail } from "../models/user.model.js";
import bcrypt from 'bcryptjs';

export const userProfile = async (req, res) => {
  const regId = req.query.regId;
  try {
    const user = await User.findOne({ reg_id: regId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const userDetails = async (req, res) => {
  const regId = req.query.regId;
  try {
    const user = await User.findOne({ reg_id: regId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const details = await Detail.findOne({ userId: user._id });
    if (!details) return res.status(404).json({ message: "Details not found" });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateUserProfile = async (req, res) => {
  const regId = req.query.regId;
  const { email, password } = req.body;
  if (!regId || !password) return res.status(400).json({ message: "All fields are required" });
  try {
    const user = await User.findOne({ reg_id: regId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) return res.status(403).json({ message: "Invalid password" });

    if (email) {
      user.email = email;
    }
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateUserDetails = async (req, res) => {
  const regId = req.query.regId;
  const { password, fullname, profilepic, phone, address, gender, postal_code } = req.body;

  if (!regId || !password) return res.status(400).json({ message: "RegId and Password is required" });

  try {
    const user = await User.findOne({ reg_id: regId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) return res.status(403).json({ message: "Invalid password" });

    let userDetails = await Detail.findOne({ userId: user._id });

    if (userDetails) {
      if (fullname) userDetails.fullname = fullname;
      if (profilepic) userDetails.profilepic = profilepic;
      if (address) userDetails.address = address;
      if (gender) userDetails.gender = gender;
      if (phone) userDetails.phone = phone;
      if (postal_code) userDetails.postal_code = postal_code;
      await userDetails.save();
      res.status(200).send(userDetails);
    } else {
      userDetails = new Detail({
        userId: user._id,
        fullname,
        profilepic,
        phone,
        address,
        gender,
        postal_code,
      });
      await userDetails.save();
      res.status(201).send(userDetails);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};