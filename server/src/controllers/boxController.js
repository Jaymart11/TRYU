"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBox = exports.updateBox = exports.createBox = exports.getSingleBox = exports.fetchBox = void 0;
const Box_1 = __importDefault(require("../models/Box"));
const fetchBox = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const box = yield Box_1.default.find({});
        res.json(box);
    }
    catch (error) {
        console.error("Error fetching box:", error);
        res.status(500).json({ error: "Error fetching box" });
    }
});
exports.fetchBox = fetchBox;
const getSingleBox = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const boxId = req.params.id;
    try {
        const box = yield Box_1.default.findById(boxId);
        if (!box) {
            return res.status(404).json({ error: "Box not found" });
        }
        res.json(box);
    }
    catch (error) {
        console.error("Error retrieving box:", error);
        res.status(500).json({ error: "Error retrieving box" });
    }
});
exports.getSingleBox = getSingleBox;
const createBox = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const boxData = req.body;
        console.log(boxData);
        const box = new Box_1.default(boxData);
        const savedBox = yield box.save();
        res.json(savedBox);
    }
    catch (error) {
        console.error("Error inserting box:", error);
        res.status(500).json({ error: "Error inserting box" });
    }
});
exports.createBox = createBox;
const updateBox = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const boxId = req.params.id;
        const { name, quantity } = req.body;
        if (!name) {
            return res.status(400).json({ message: "No fields to update" });
        }
        const existingBox = yield Box_1.default.findById(boxId);
        if (!existingBox) {
            return res.status(404).json({ message: "Box not found" });
        }
        if (name)
            existingBox.name = name;
        if (quantity)
            existingBox.quantity = quantity;
        yield existingBox.save();
        return res.status(200).json(existingBox);
    }
    catch (error) {
        console.error("Error editing box:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateBox = updateBox;
const deleteBox = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const boxId = req.params.id;
    try {
        const deletedBox = yield Box_1.default.findByIdAndDelete(boxId);
        if (!deletedBox) {
            return res.status(404).json({ error: "Box not found" });
        }
        res.json({ message: "Box deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting box:", error);
        res.status(500).json({ error: "Error deleting box" });
    }
});
exports.deleteBox = deleteBox;
