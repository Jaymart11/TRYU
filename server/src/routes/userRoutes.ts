import express from "express";
import {
  fetchUser,
  userLogin,
  createUser,
  updateUser,
  deleteUser,
  getSingleUser,
} from "../controllers/userController";

const router = express.Router();

router.get("/", fetchUser);
router.get("/login", userLogin);
router.get("/:id", getSingleUser);
router.post("/create", createUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

export default router;
