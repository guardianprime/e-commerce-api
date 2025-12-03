import { Router, Request, Response } from "express";
import Product from "../models/productModel.js";

const productRoutes = Router();

//this is to get all the products in the database
productRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(limit);

    const total = await Product.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.json({
      status: "success",
      page,
      limit,
      total,
      totalPages,
      count: products.length,
      data: products,
    });
    // const data = await ProductSchema;
  } catch (error) {}
});

// this is for adding new products
productRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const newProduct = new Product(req.body);

    await newProduct.save();

    res.status(201).json({
      status: "success",
      data: newProduct,
    });
  } catch (error: any) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
});

//this is for updating products
productRoutes.put("/:id", async (req: Request, res: Response) => {
  try {
    await Product.findByIdAndUpdate(req.query.id);
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

productRoutes.delete("/:id", async (req: Request, res: Response) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      message: `Product with ${req.params.id} deleted`,
    });
  } catch (error: any) {
    res.status(405).json({
      status: "failed",
      message: error.message,
    });
  }
});

export default productRoutes;
