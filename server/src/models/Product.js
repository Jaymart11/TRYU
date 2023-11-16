"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Category_1 = __importDefault(require("./Category"));
const Box_1 = __importDefault(require("./Box"));
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: Category_1.default, required: true },
    box: { type: mongoose_1.Schema.Types.ObjectId, ref: Box_1.default },
    active: { type: Boolean, default: true },
    quantity: { type: Number },
    price: { type: Number, required: true },
    combo: [
        {
            product: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Product",
            },
        },
    ],
    withDrink: { type: Boolean, default: false },
}, { timestamps: true });
const Product = (0, mongoose_1.model)("Product", productSchema, "products");
exports.default = Product;
