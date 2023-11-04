import { Request, Response } from "express";
import Expense from "../models/Expense";
import Product from "../models/Product";

export const fetchExpense = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) + 1; // Get the page number from the query parameter (default to 1)
  const perPage = parseInt(req.query.perPage as string) || 10; // Get the number of items per page from the query parameter (default to 10)

  try {
    const totalCount = await Expense.countDocuments();
    const totalPages = Math.ceil(totalCount / perPage);

    const expenses = await Expense.find()
      .populate("product_id", "name")
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.json({
      expenses,
      page,
      totalCount,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching expenses" });
  }
};

export const getSingleExpense = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const expense = await Expense.findById(id).populate("product_id");
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: "Error fetching expense" });
  }
};

export const createExpense = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const { name, product_id, quantity, amount } = req.body;
    console.log(product_id);

    // Create the expense
    let expense = new Expense({ name, product_id, quantity, amount });

    // If product_id is provided, update the product's quantity
    if (product_id) {
      const product = await Product.findById(product_id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Subtract the amount from the product's quantity
      if (product?.quantity !== undefined) {
        product.quantity -= quantity;
        await product.save();
      }
    } else {
      expense = new Expense({ name, quantity, amount });
    }

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: "Error creating expense" });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const currentExpense = await Expense.findById(id);
    const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedExpense || !currentExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    // If product_id is provided in the updated data
    if (req.body.product_id) {
      const product = await Product.findById(req.body.product_id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Subtract the updated amount from the new product's quantity
      if (product?.quantity !== undefined) {
        if (currentExpense.quantity > updatedExpense.quantity) {
          product.quantity += currentExpense.quantity - updatedExpense.quantity;
        } else if (currentExpense.quantity < updatedExpense.quantity) {
          product.quantity -= updatedExpense.quantity - currentExpense.quantity;
        }
      }

      await product.save();

      // If the product_id was changed, restore the quantity to the previous product
    }

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ error: "Error updating expense" });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const currentExpense = await Expense.findById(id);

    if (!currentExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    if (currentExpense.product_id) {
      const product = await Product.findById(currentExpense.product_id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (product?.quantity !== undefined)
        product.quantity += currentExpense.quantity;

      await product.save();

      // If the product_id was changed, restore the quantity to the previous product
    }

    const deletedExpense = await Expense.findByIdAndRemove(id);
    if (!deletedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json(deletedExpense);
  } catch (error) {
    res.status(500).json({ error: "Error deleting expense" });
  }
};
