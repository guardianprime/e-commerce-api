import { Router } from "express";

const paymentRoutes = Router();

paymentRoutes.get("/", (req, res) => {
  res.send("this is the payment routes");
});

export default paymentRoutes;
