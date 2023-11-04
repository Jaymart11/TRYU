import express from "express";
import {
  createBox,
  deleteBox,
  fetchBox,
  getSingleBox,
  updateBox,
} from "../controllers/boxController";

const router = express.Router();

router.get("/", fetchBox);
router.get("/:id", getSingleBox);
router.post("/create", createBox);
router.put("/update/:id", updateBox);
router.delete("/delete/:id", deleteBox);

export default router;
