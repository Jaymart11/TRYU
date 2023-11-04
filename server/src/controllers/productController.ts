import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { IProduct } from "../../shared/interface/IProduct";
import Box from "../models/Box";
import Category from "../models/Category";
import Product from "../models/Product";

export const getProduct = async (req: Request, res: Response) => {
  const categoryID = req.query.category_id;
  const search = req.query.search;

  let query = {};

  if (categoryID) {
    query = { _id: categoryID };
  }

  try {
    // Find all categories
    const categories = await Category.find(query).exec();

    // Create an array to hold the formatted category data
    const formattedCategories = [];

    // Loop through each category and fetch associated products with pagination and search
    for (const category of categories) {
      let productQuery: any = { category: category._id };

      if (search) {
        // Add search criteria to the product query
        productQuery = {
          ...productQuery,
          $or: [
            { name: { $regex: search, $options: "i" } }, // Case-insensitive search by product name
            { code: { $regex: search, $options: "i" } }, // Case-insensitive search by product code
          ],
        };
      }
      const products = await Product.find(productQuery)
        .populate("box", "quantity")
        .exec();
      const formattedCategory = {
        name: category.name,
        product: products.map((product) => ({
          _id: product._id,
          name: product.name,
          code: product.code,
          quantity: product.quantity,
          price: product.price,
          box: product.box,
        })),
      };

      if (formattedCategory.product.length) {
        formattedCategories.push(formattedCategory);
      }
    }

    res.json(formattedCategories);
  } catch (error) {
    console.error("Error retrieving categories:", error);
    res.status(500).json({ error: "Error retrieving categories" });
  }
};

export const getSingleProduct = async (req: Request, res: Response) => {
  const productId: string = req.params.id;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ error: "Error retrieving product" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      code,
      category,
      active = true,
      quantity,
      price = 0,
      box,
    }: IProduct = req.body;

    if (!name || !code || !category || !box) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!isValidObjectId(category)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    // Check if a product with the same code already exists
    const existingProduct = await Product.findOne({ code });
    if (existingProduct) {
      return res.status(409).json({ message: "Product code already exists" });
    }

    // Check if the category exists
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const existingBox = await Box.findById(box);
    if (!existingBox) {
      return res.status(404).json({ message: "Box not found" });
    }

    const newProduct = new Product({
      name,
      code,
      category,
      active,
      quantity,
      price,
      box,
    });

    await newProduct.save();

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id; // Assuming you're passing the product ID as a URL parameter
    const { name, category, code, quantity, price, box }: Partial<IProduct> =
      req.body;

    if (!name && !category && !price && !code && !box) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (category && !isValidObjectId(category)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    if (category) {
      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    if (name) existingProduct.name = name;
    if (code) existingProduct.code = code;
    if (category) existingProduct.category = category;
    if (quantity !== undefined) existingProduct.quantity = quantity;
    if (price) existingProduct.price = price;
    if (box) existingProduct.box = box;

    await existingProduct.save();

    return res.status(200).json(existingProduct);
  } catch (error) {
    console.error("Error editing product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const productId: string = req.params.id;

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Error deleting product" });
  }
};
