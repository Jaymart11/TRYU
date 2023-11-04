"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const router = express_1.default.Router();
router.get("/", productController_1.getProduct);
router.get("/:id", productController_1.getSingleProduct);
router.post("/create", productController_1.createProduct);
router.put("/update/:id", productController_1.updateProduct);
router.delete("/delete/:id", productController_1.deleteProduct);
exports.default = router;
