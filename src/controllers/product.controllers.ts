import { Request, Response } from "express";
import Product from "../models/product.models.js";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(limit);

    const total = await Product.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      message: "All products has been sent",
      page,
      limit,
      total,
      totalPages,
      count: products.length,
      data: products,
    });
    // const data = await ProductSchema;
  } catch (error) {}
};

export const addNewProduct = async (req: Request, res: Response) => {
  try {
    const newProduct = new Product(req.body);

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "new product has been added",
      data: newProduct,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    // only things allowed to be changed by admin
    const allowedUpdates = [
      "name",
      "price",
      "description",
      "stock",
      "category",
    ];
    const updates: Record<string, any> = {};

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    // this will prevent empty update requests
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    // Update product and return the NEW version
    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Product successfully updated",
      data: updatedProduct,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error while updating product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: false,
      message: `Product with ${req.params.id} deleted`,
    });
  } catch (error: any) {
    res.status(405).json({
      success: false,
      message: error.message,
    });
  }
};
