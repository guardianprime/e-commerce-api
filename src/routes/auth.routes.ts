import { Router } from "express";
import dotenv from "dotenv";
import {
  loginController,
  signupController,
} from "../controllers/auth.controllers.js";
dotenv.config();

const authRoutes = Router();

authRoutes.get("/", (req, res) => {
  res.send("this is the auth routes");
});

authRoutes.post("/signup", signupController);

authRoutes.post("/login", loginController);

export default authRoutes;
