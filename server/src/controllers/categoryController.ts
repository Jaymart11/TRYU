import { Request, Response } from "express";
import { ICategory } from "../../shared/interface/ICategory";
import Category from "../models/Category";

export const fetchCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.find({}, "name _id");
    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Error fetching category" });
  }
};

export const getSingleCategory = async (req: Request, res: Response) => {
  const categoryId: string = req.params.id;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    console.error("Error retrieving category:", error);
    res.status(500).json({ error: "Error retrieving category" });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const categoryData: ICategory = req.body;
    const category = new Category(categoryData);
    const savedCategory = await category.save();

    res.json(savedCategory);
  } catch (error) {
    console.error("Error inserting product:", error);
    res.status(500).json({ error: "Error inserting product" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;
    const { name }: ICategory = req.body;

    if (!name) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (name) existingCategory.name = name;

    await existingCategory.save();

    return res.status(200).json(existingCategory);
  } catch (error) {
    console.error("Error editing category:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const categoryId: string = req.params.id;

  try {
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Error deleting category" });
  }
};
