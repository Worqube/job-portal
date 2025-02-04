import { User, Detail } from "../models/user.model.js";

export const Details = async (req, res) => {
  try {
    const details = await Detail.find({ userId: req.params.userId });
    res.status(200).send(details);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const NewUser = async (req, res) => {
  try {
    const { email, fullname, password } = req.body;
    const user = new User({ email, fullname, password });
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const NewDetail = async (req, res) => {
  try {
    const { address, phone, gender } = req.body;
    const detail = new Detail({
      userId: req.params.userId,
      address,
      phone,
      gender,
    });
    await detail.save();
    res.status(201).send(detail);
  } catch (error) {
    res.status(400).send(error);
  }
};
