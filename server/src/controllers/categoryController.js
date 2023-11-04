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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getSingleCategory = exports.fetchCategory = void 0;
const Category_1 = __importDefault(require("../models/Category"));
const fetchCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield Category_1.default.find({}, "name _id");
        res.json(category);
    }
    catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({ error: "Error fetching category" });
    }
});
exports.fetchCategory = fetchCategory;
const getSingleCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.id;
    try {
        const category = yield Category_1.default.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json(category);
    }
    catch (error) {
        console.error("Error retrieving category:", error);
        res.status(500).json({ error: "Error retrieving category" });
    }
});
exports.getSingleCategory = getSingleCategory;
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryData = req.body;
        const category = new Category_1.default(categoryData);
        const savedCategory = yield category.save();
        res.json(savedCategory);
    }
    catch (error) {
        console.error("Error inserting product:", error);
        res.status(500).json({ error: "Error inserting product" });
    }
});
exports.createCategory = createCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.params.id;
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "No fields to update" });
        }
        const existingCategory = yield Category_1.default.findById(categoryId);
        if (!existingCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        if (name)
            existingCategory.name = name;
        yield existingCategory.save();
        return res.status(200).json(existingCategory);
    }
    catch (error) {
        console.error("Error editing category:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.id;
    try {
        const deletedCategory = yield Category_1.default.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: "Error deleting category" });
    }
});
exports.deleteCategory = deleteCategory;
