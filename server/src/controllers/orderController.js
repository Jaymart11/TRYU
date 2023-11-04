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
exports.deleteOrder = exports.updateOrder = exports.createOrder = exports.fetchSingleOrder = exports.fetchOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const Box_1 = __importDefault(require("../models/Box"));
const fetchOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order_1.default.find();
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(500).json({ error: "Could not fetch orders." });
    }
});
exports.fetchOrder = fetchOrder;
const fetchSingleOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield Order_1.default.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found." });
        }
        res.status(200).json(order);
    }
    catch (error) {
        res.status(500).json({ error: "Could not fetch the order." });
    }
});
exports.fetchSingleOrder = fetchSingleOrder;
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const newOrder = new Order_1.default(req.body);
        const savedOrder = yield newOrder.save();
        res.status(201).json(savedOrder);
        for (const orderProduct of newOrder.products) {
            const product = yield Product_1.default.findById(orderProduct.product);
            if (!product) {
                throw new Error(`Product with ID ${orderProduct.product} not found.`);
            }
            const box = yield Box_1.default.findById(product.box);
            if (!box) {
                throw new Error(`Box with ID ${product.box} not found.`);
            }
            if (product.quantity &&
                (orderProduct.less === undefined || ((_a = orderProduct.less) === null || _a === void 0 ? void 0 : _a.length) === 0)) {
                product.quantity -= orderProduct.quantity;
            }
            else if (orderProduct.less) {
                for (const prod of orderProduct.less) {
                    const lessProduct = yield Product_1.default.findById(prod.product);
                    if (lessProduct && lessProduct.quantity) {
                        lessProduct.quantity -= prod.quantity;
                        yield lessProduct.save();
                    }
                }
            }
            box.quantity -= orderProduct.quantity;
            yield product.save();
            yield box.save();
        }
    }
    catch (error) {
        res.status(400).json({ error: "Could not create the order." });
    }
});
exports.createOrder = createOrder;
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedOrder = yield Order_1.default.findByIdAndUpdate(req.params.orderId, req.body, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found." });
        }
        res.status(200).json(updatedOrder);
    }
    catch (error) {
        res.status(500).json({ error: "Could not update the order." });
    }
});
exports.updateOrder = updateOrder;
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedOrder = yield Order_1.default.findByIdAndDelete(req.params.orderId);
        if (!deletedOrder) {
            return res.status(404).json({ error: "Order not found." });
        }
        res.status(204).send(); // No content on successful deletion
    }
    catch (error) {
        res.status(500).json({ error: "Could not delete the order." });
    }
});
exports.deleteOrder = deleteOrder;
