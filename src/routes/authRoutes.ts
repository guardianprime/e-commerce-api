import { Router } from "express";
import { Jwt } from "jsonwebtoken";

const authRoutes = Router();

authRoutes.get("/", (req, res) => {
  res.send("this is the auth routes");
});

export default authRoutes;
