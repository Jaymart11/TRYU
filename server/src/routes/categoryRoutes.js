"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("../controllers/categoryController");
const router = express_1.default.Router();
router.get("/", categoryController_1.fetchCategory);
router.get("/:id", categoryController_1.getSingleCategory);
router.post("/create", categoryController_1.createCategory);
router.put("/update/:id", categoryController_1.updateCategory);
router.delete("/delete/:id", categoryController_1.deleteCategory);
exports.default = router;
