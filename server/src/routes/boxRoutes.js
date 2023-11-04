"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const boxController_1 = require("../controllers/boxController");
const router = express_1.default.Router();
router.get("/", boxController_1.fetchBox);
router.get("/:id", boxController_1.getSingleBox);
router.post("/create", boxController_1.createBox);
router.put("/update/:id", boxController_1.updateBox);
router.delete("/delete/:id", boxController_1.deleteBox);
exports.default = router;
