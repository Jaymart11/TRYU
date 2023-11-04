"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const boxRoutes_1 = __importDefault(require("./routes/boxRoutes"));
const expenseRoutes_1 = __importDefault(require("./routes/expenseRoutes"));
const app = (0, express_1.default)();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});
app.use(express_1.default.json());
app.use("/products", productRoutes_1.default);
app.use("/category", categoryRoutes_1.default);
app.use("/user", userRoutes_1.default);
app.use("/order", orderRoutes_1.default);
app.use("/report", reportRoutes_1.default);
app.use("/box", boxRoutes_1.default);
app.use("/expense", expenseRoutes_1.default);
exports.default = app;
