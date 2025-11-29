import express, { Request, Response, NextFunction } from "express";
import authRoutes from "./routes/authRoutes.js";

// Initialize Express app
const app = express();
const PORT = process.env.PORT;

// Routes
app.use("/api/users", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
