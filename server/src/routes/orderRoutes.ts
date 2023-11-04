import express from "express";
import {
  createOrder,
  fetchOrder,
  fetchSingleOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController";

const router = express.Router();

router.get("/", fetchOrder);
router.get("/:orderId", fetchSingleOrder);
router.post("/create", createOrder);
router.put("/update/:orderId", updateOrder);
router.delete("/delete/:orderId", deleteOrder);

export default router;
