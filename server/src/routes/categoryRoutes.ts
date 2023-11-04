import express from "express";
import {
  createCategory,
  deleteCategory,
  fetchCategory,
  getSingleCategory,
  updateCategory,
} from "../controllers/categoryController";

const router = express.Router();

router.get("/", fetchCategory);
router.get("/:id", getSingleCategory);
router.post("/create", createCategory);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

export default router;
