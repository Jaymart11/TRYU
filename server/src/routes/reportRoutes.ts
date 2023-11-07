import express from "express";
import {
  exportReports,
  updateQuantity,
  updateBoxQuantity,
} from "../controllers/reportsController";

const router = express.Router();

router.get("/export", exportReports);
router.post("/quantity", updateQuantity);
router.post("/boxQuantity", updateBoxQuantity);

export default router;
