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
exports.deleteExpense = exports.updateExpense = exports.createExpense = exports.getSingleExpense = exports.fetchExpense = void 0;
const Expense_1 = __importDefault(require("../models/Expense"));
const Product_1 = __importDefault(require("../models/Product"));
const fetchExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) + 1; // Get the page number from the query parameter (default to 1)
    const perPage = parseInt(req.query.perPage) || 10; // Get the number of items per page from the query parameter (default to 10)
    try {
        const totalCount = yield Expense_1.default.countDocuments();
        const totalPages = Math.ceil(totalCount / perPage);
        const expenses = yield Expense_1.default.find()
            .populate("product_id", "name")
            .skip((page - 1) * perPage)
            .limit(perPage);
        res.json({
            expenses,
            page,
            totalCount,
            totalPages,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching expenses" });
    }
});
exports.fetchExpense = fetchExpense;
const getSingleExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const expense = yield Expense_1.default.findById(id).populate("product_id");
        if (!expense) {
            return res.status(404).json({ error: "Expense not found" });
        }
        res.json(expense);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching expense" });
    }
});
exports.getSingleExpense = getSingleExpense;
const createExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        const { name, product_id, quantity, amount } = req.body;
        console.log(product_id);
        // Create the expense
        let expense = new Expense_1.default({ name, product_id, quantity, amount });
        // If product_id is provided, update the product's quantity
        if (product_id) {
            const product = yield Product_1.default.findById(product_id);
            if (!product) {
                return res.status(404).json({ error: "Product not found" });
            }
            // Subtract the amount from the product's quantity
            if ((product === null || product === void 0 ? void 0 : product.quantity) !== undefined) {
                product.quantity -= quantity;
                yield product.save();
            }
        }
        else {
            expense = new Expense_1.default({ name, quantity, amount });
        }
        yield expense.save();
        res.status(201).json(expense);
    }
    catch (error) {
        res.status(500).json({ error: "Error creating expense" });
    }
});
exports.createExpense = createExpense;
const updateExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const currentExpense = yield Expense_1.default.findById(id);
        const updatedExpense = yield Expense_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (!updatedExpense || !currentExpense) {
            return res.status(404).json({ error: "Expense not found" });
        }
        // If product_id is provided in the updated data
        if (req.body.product_id) {
            const product = yield Product_1.default.findById(req.body.product_id);
            if (!product) {
                return res.status(404).json({ error: "Product not found" });
            }
            // Subtract the updated amount from the new product's quantity
            if ((product === null || product === void 0 ? void 0 : product.quantity) !== undefined) {
                if (currentExpense.quantity > updatedExpense.quantity) {
                    product.quantity += currentExpense.quantity - updatedExpense.quantity;
                }
                else if (currentExpense.quantity < updatedExpense.quantity) {
                    product.quantity -= updatedExpense.quantity - currentExpense.quantity;
                }
            }
            yield product.save();
            // If the product_id was changed, restore the quantity to the previous product
        }
        res.json(updatedExpense);
    }
    catch (error) {
        res.status(500).json({ error: "Error updating expense" });
    }
});
exports.updateExpense = updateExpense;
const deleteExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const currentExpense = yield Expense_1.default.findById(id);
        if (!currentExpense) {
            return res.status(404).json({ error: "Expense not found" });
        }
        if (currentExpense.product_id) {
            const product = yield Product_1.default.findById(currentExpense.product_id);
            if (!product) {
                return res.status(404).json({ error: "Product not found" });
            }
            if ((product === null || product === void 0 ? void 0 : product.quantity) !== undefined)
                product.quantity += currentExpense.quantity;
            yield product.save();
            // If the product_id was changed, restore the quantity to the previous product
        }
        const deletedExpense = yield Expense_1.default.findByIdAndRemove(id);
        if (!deletedExpense) {
            return res.status(404).json({ error: "Expense not found" });
        }
        res.json(deletedExpense);
    }
    catch (error) {
        res.status(500).json({ error: "Error deleting expense" });
    }
});
exports.deleteExpense = deleteExpense;
