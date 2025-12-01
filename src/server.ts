import express, { Request, Response, NextFunction } from "express";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./db.js";
import * as dotenv from "dotenv";
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

// Middlewares
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
