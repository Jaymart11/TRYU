"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    products: [
        {
            product: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            box: { type: mongoose_1.Schema.Types.ObjectId, ref: "Box", required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            less: [
                {
                    product: {
                        type: mongoose_1.Schema.Types.ObjectId,
                        ref: "Product",
                        required: true,
                    },
                    name: { type: String, required: true },
                    quantity: { type: Number, required: true },
                },
            ],
        },
    ],
    cashier: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["Cash"], required: true },
    orderType: {
        type: String,
        enum: ["Dine-In", "Take-Out", "Grab", "Food Panda"],
        required: true,
    },
    discount: { type: Number },
}, { timestamps: true });
const Order = (0, mongoose_1.model)("Order", orderSchema, "order");
exports.default = Order;
