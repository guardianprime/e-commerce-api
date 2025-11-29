import express, { Request, Response, NextFunction } from "express";

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Routes
app.get("/api/users", (req: Request, res: Response) => {
  res.json({
    state: "success",
    message: "this is the users route",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
