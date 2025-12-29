import express from "express";
import { connectDB } from "./db.js";
import * as dotenv from "dotenv";
import router from "./routes/index.routes.js";
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

// Middlewares
app.use(express.json());

// Routes
app.use("/api/v1/", router);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
