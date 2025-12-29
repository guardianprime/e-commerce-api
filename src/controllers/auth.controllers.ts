import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";

export const signupController = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      res
        .status(400)
        .json({ status: "failed", message: "This email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res
      .status(201)
      .json({ status: "success", message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ status: "failed", message: "Server error" });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const payload = { id: user._id, email: user.email };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "15m",
    });

    res.status(200).json({ status: "successful", data: token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
