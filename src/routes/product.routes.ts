import { Router } from "express";
import {
  addNewProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../controllers/product.controllers.js";

const productRoutes = Router();

productRoutes.get("/", getAllProducts);

productRoutes.post("/", addNewProduct);

productRoutes.patch("/:id", updateProduct);

productRoutes.delete("/:id", deleteProduct);

export default productRoutes;
