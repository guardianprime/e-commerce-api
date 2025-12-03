import { Router } from "express";
import Product from "../models/productModel.js";

const productRoutes = Router();

//this is to get all the products in the database
productRoutes.get("/", async (req, res) => {
  try {
    res.json({ status: "success", data: "this is the project!!" });
    // const data = await ProductSchema;
  } catch (error) {}
});

// this is for adding new products
productRoutes.post("/", async (req, res) => {
  try {
    const newProduct = new Product(req.body);

    await newProduct.save();

    res.status(201).json({
      status: "success",
      data: newProduct,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
});

//this is for updating products
productRoutes.put("/:id", async (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      message: "product successfully updated",
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error,
    });
  }
});

export default productRoutes;
