import express from "express";
import routes from "./routes/index.js";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";

dotenv.config();

const app = express();

// SECURITY
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// BODY  PARSER
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CHECK API HEALTH
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

// ROUTES
app.use("/api/v1", routes);

app.listen(3000, () => {
  console.log("server running on port 3000");
});
