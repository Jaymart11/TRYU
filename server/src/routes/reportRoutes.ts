import express from "express";
import {
  exportReports,
  updateQuantity,
} from "../controllers/reportsController";

const router = express.Router();

router.get("/export", exportReports);
router.post("/quantity", updateQuantity);

export default router;
