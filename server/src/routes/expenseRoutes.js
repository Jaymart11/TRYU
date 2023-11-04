"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expenseController_1 = require("../controllers/expenseController");
const router = express_1.default.Router();
router.get("/", expenseController_1.fetchExpense);
router.get("/:id", expenseController_1.getSingleExpense);
router.post("/create", expenseController_1.createExpense);
router.put("/update/:id", expenseController_1.updateExpense);
router.delete("/delete/:id", expenseController_1.deleteExpense);
exports.default = router;
