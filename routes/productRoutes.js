import { Router } from "express";

const productRoutes = Router();

productRoutes.get("/", (req, res) => {
  res.send("this is the product routes");
});

export default productRoutes;
