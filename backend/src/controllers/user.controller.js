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

export const loadData = async (req, res) => {
  const { reg_id } = req.body;
  // if (!reg_id) return res.status(400).json({ message: "RegID is required" });

  try {
    const user = await User.findOne({ reg_id: reg_id });
    if (!user) return res.status(404).json({ message: "User not found" });

    const userDetails = await Detail.findOne({ userId: user._id });

    const userData = {
      reg_id: user.reg_id,
      email: user.email,
      fullname: userDetails.fullname,
      profilepic: userDetails.profilepic,
      address: userDetails.address,
      gender: userDetails.gender,
      phone: userDetails.phone,
      postal_code: userDetails.postal_code,
      branch: userDetails.branch,
    }
    res.status(200).send(userData);
  } catch (error) {
    res.status(500).send(error);
  }
}

export const editProfile = async (req, res) => {
  const { reg_id } = req.params;
  const { fullname, branch, phone, gender, address } = req.body;
  try {
    const user = await User.findOne({ reg_id: reg_id });
    if (!user) return res.status(404).json({ message: "User not found" });

    const details = await Detail.findOne({ userId: user._id });
    if (details) {
      details.fullname = fullname;
      details.branch = branch;
      details.phone = phone;
      details.gender = gender;
      details.address = address;

      await details.save();
      res.status(200).send(details);
    } else {
      return res.status(404).json({ message: "Details not found" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
}