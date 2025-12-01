import { Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const authRoutes = Router();

authRoutes.get("/", (req, res) => {
  res.send("this is the auth routes");
});

authRoutes.post("/signup", async (req, res) => {
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
});

authRoutes.post("/login", async (req, res) => {
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
});

export default authRoutes;
