import express from "express";
import {
  createProduct,
  getProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";

const router = express.Router();

router.get("/", getProduct);
router.get("/:id", getSingleProduct);
router.post("/create", createProduct);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

export default router;
