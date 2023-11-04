import express from "express";
import {
  createExpense,
  deleteExpense,
  fetchExpense,
  getSingleExpense,
  updateExpense,
} from "../controllers/expenseController";

const router = express.Router();

router.get("/", fetchExpense);
router.get("/:id", getSingleExpense);
router.post("/create", createExpense);
router.put("/update/:id", updateExpense);
router.delete("/delete/:id", deleteExpense);

export default router;
