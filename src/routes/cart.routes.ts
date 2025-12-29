import { Router } from "express";

const cartRoutes = Router();

cartRoutes.get("/", (req, res) => {
  res.send("this is the cart routes");
});

export default cartRoutes;
