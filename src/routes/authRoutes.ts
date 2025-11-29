import { Router } from "express";

const authRoutes = Router();

authRoutes.get("/", (req, res) => {
  res.send("this is the auth routes");
});

export default authRoutes;
