import express, { Request, Response, NextFunction } from "express";
import authRoutes from "./routes/authRoutes.js";
import * as dotenv from "dotenv";
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Routes
app.use("/api/users", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
