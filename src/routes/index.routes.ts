import express from "express";
const router = express.Router();

import authRoutes from "./auth.routes.js";
import productRoutes from "./product.routes.js";
import orderRoutes from "./order.routes.js";
import cartRoutes from "./cart.routes.js";
import authMiddleware from "../middlewares/auth.middlewares.js";

router.use("/auth", authRoutes);
router.use("/products", authMiddleware, productRoutes);
router.use("/orders", authMiddleware, orderRoutes);
router.use("/cart", authMiddleware, cartRoutes);

export default router;
