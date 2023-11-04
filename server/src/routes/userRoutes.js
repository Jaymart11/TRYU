"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.get("/", userController_1.fetchUser);
router.get("/login", userController_1.userLogin);
router.get("/:id", userController_1.getSingleUser);
router.post("/create", userController_1.createUser);
router.put("/update/:id", userController_1.updateUser);
router.delete("/delete/:id", userController_1.deleteUser);
exports.default = router;
