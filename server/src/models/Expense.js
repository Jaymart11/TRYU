"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// import { IQuantity } from "../../shared/interface/IQuantity";
const expenseSchema = new mongoose_1.Schema({
    name: { type: String },
    product_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true },
}, { timestamps: true });
const Expense = (0, mongoose_1.model)("Expense", expenseSchema, "expenses");
exports.default = Expense;
