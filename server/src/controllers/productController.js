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
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getSingleProduct = exports.getProduct = void 0;
const mongoose_1 = require("mongoose");
const Box_1 = __importDefault(require("../models/Box"));
const Category_1 = __importDefault(require("../models/Category"));
const Product_1 = __importDefault(require("../models/Product"));
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryID = req.query.category_id;
    const search = req.query.search;
    let query = {};
    if (categoryID) {
        query = { _id: categoryID };
    }
    try {
        // Find all categories
        const categories = yield Category_1.default.find(query).exec();
        // Create an array to hold the formatted category data
        const formattedCategories = [];
        // Loop through each category and fetch associated products with pagination and search
        for (const category of categories) {
            let productQuery = { category: category._id };
            if (search) {
                // Add search criteria to the product query
                productQuery = Object.assign(Object.assign({}, productQuery), { $or: [
                        { name: { $regex: search, $options: "i" } },
                        { code: { $regex: search, $options: "i" } }, // Case-insensitive search by product code
                    ] });
            }
            const products = yield Product_1.default.find(productQuery)
                .populate("box", "quantity")
                .exec();
            const formattedCategory = {
                name: category.name,
                product: products.map((product) => ({
                    _id: product._id,
                    name: product.name,
                    code: product.code,
                    quantity: product.quantity,
                    price: product.price,
                    box: product.box,
                })),
            };
            if (formattedCategory.product.length) {
                formattedCategories.push(formattedCategory);
            }
        }
        res.json(formattedCategories);
    }
    catch (error) {
        console.error("Error retrieving categories:", error);
        res.status(500).json({ error: "Error retrieving categories" });
    }
});
exports.getProduct = getProduct;
const getSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    try {
        const product = yield Product_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
    }
    catch (error) {
        console.error("Error retrieving product:", error);
        res.status(500).json({ error: "Error retrieving product" });
    }
});
exports.getSingleProduct = getSingleProduct;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, code, category, active = true, quantity, price = 0, box, } = req.body;
        if (!name || !code || !category || !box) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        if (!(0, mongoose_1.isValidObjectId)(category)) {
            return res.status(400).json({ message: "Invalid category ID" });
        }
        // Check if a product with the same code already exists
        const existingProduct = yield Product_1.default.findOne({ code });
        if (existingProduct) {
            return res.status(409).json({ message: "Product code already exists" });
        }
        // Check if the category exists
        const existingCategory = yield Category_1.default.findById(category);
        if (!existingCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        const existingBox = yield Box_1.default.findById(box);
        if (!existingBox) {
            return res.status(404).json({ message: "Box not found" });
        }
        const newProduct = new Product_1.default({
            name,
            code,
            category,
            active,
            quantity,
            price,
            box,
        });
        yield newProduct.save();
        return res.status(201).json(newProduct);
    }
    catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id; // Assuming you're passing the product ID as a URL parameter
        const { name, category, code, quantity, price, box } = req.body;
        if (!name && !category && !price && !code && !box) {
            return res.status(400).json({ message: "No fields to update" });
        }
        const existingProduct = yield Product_1.default.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (category && !(0, mongoose_1.isValidObjectId)(category)) {
            return res.status(400).json({ message: "Invalid category ID" });
        }
        if (category) {
            const existingCategory = yield Category_1.default.findById(category);
            if (!existingCategory) {
                return res.status(404).json({ message: "Category not found" });
            }
        }
        if (name)
            existingProduct.name = name;
        if (code)
            existingProduct.code = code;
        if (category)
            existingProduct.category = category;
        if (quantity !== undefined)
            existingProduct.quantity = quantity;
        if (price)
            existingProduct.price = price;
        if (box)
            existingProduct.box = box;
        yield existingProduct.save();
        return res.status(200).json(existingProduct);
    }
    catch (error) {
        console.error("Error editing product:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    try {
        const deletedProduct = yield Product_1.default.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json({ message: "Product deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Error deleting product" });
    }
});
exports.deleteProduct = deleteProduct;
