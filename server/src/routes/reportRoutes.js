"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reportsController_1 = require("../controllers/reportsController");
const router = express_1.default.Router();
router.get("/export", reportsController_1.exportReports);
router.post("/quantity", reportsController_1.updateQuantity);
exports.default = router;
