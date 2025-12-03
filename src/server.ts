import express from "express";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./db.js";
import * as dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import auth from "./middlewares/authMiddleware.js";
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

// Middlewares
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", auth, productRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
