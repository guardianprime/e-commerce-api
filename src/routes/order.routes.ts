import { Router } from "express";

const orderRoutes = Router();

orderRoutes.get("/", (req, res) => {
  res.send("this is the order routes");
});

export default orderRoutes;
