"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const router = express_1.default.Router();
router.get("/", orderController_1.fetchOrder);
router.get("/:orderId", orderController_1.fetchSingleOrder);
router.post("/create", orderController_1.createOrder);
router.put("/update/:orderId", orderController_1.updateOrder);
router.delete("/delete/:orderId", orderController_1.deleteOrder);
exports.default = router;
