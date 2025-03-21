import { User, Detail } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
export const upload = multer({ storage }).single('profilepic');

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

    let details = await Detail.findOne({ userId: user._id });
    if (!details) {
      details = new Detail({ userId: user._id });
    }

    // Update text fields
    details.fullname = fullname || details.fullname;
    details.branch = branch || details.branch;
    details.phone = phone || details.phone;
    details.gender = gender || details.gender;
    details.address = address || details.address;

    // Upload new profile picture if provided
    if (req.file) {
      try {
        // Delete previous profile picture from Cloudinary
        if (details.profilepic) {
          const publicId = details.profilepic.split("/").pop().split(".")[0]; // Extract public ID
          await cloudinary.uploader.destroy(`profile_pictures/${publicId}`);
        }

        // Upload new profile picture
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "profile_pictures" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          uploadStream.end(req.file.buffer);
        });

        if (result && result.secure_url) {
          details.profilepic = result.secure_url;
          details.markModified("profilepic"); // Ensure Mongoose detects change
        }
      } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        return res.status(500).json({ message: "Image upload failed", error });
      }
    }

    await details.save();
    return res.status(200).json({ message: "Profile updated successfully", details });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
