"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.exportReports = exports.updateBoxQuantity = exports.updateQuantity = void 0;
const Box_1 = __importDefault(require("../models/Box"));
const BoxQuantity_1 = __importDefault(require("../models/BoxQuantity"));
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const Quantity_1 = __importDefault(require("../models/Quantity"));
const schedule = require("node-schedule");
const ExcelJS = __importStar(require("exceljs"));
const reportHeaders = [
    "ITEMS",
    "PRICE",
    "STARTING",
    "ENDING",
    "LESS P/H/F",
    "RELEASING",
    "SALES AMOUNT",
];
const updateQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Step 1: Get the latest quantity for each product
        const products = yield Product_1.default.find();
        const newQuantity = new Quantity_1.default({
            products: products.map(({ quantity, _id, price }) => ({
                product: _id,
                quantity,
                price,
            })),
        });
        yield newQuantity.save();
    }
    catch (error) {
        console.error("Error creating quantities:", error);
        throw error;
    }
});
exports.updateQuantity = updateQuantity;
const updateBoxQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Step 1: Get the latest quantity for each product
        const box = yield Box_1.default.find();
        const newQuantity = new BoxQuantity_1.default({
            boxes: box.map(({ quantity, _id }) => ({
                box: _id,
                quantity,
            })),
        });
        yield newQuantity.save();
    }
    catch (error) {
        console.error("Error creating quantities:", error);
        throw error;
    }
});
exports.updateBoxQuantity = updateBoxQuantity;
// Schedule the task to run at 12 AM every day
const rule = new schedule.RecurrenceRule();
rule.hour = 2;
rule.minute = 16;
rule.second = 25;
const _job = schedule.scheduleJob(rule, exports.updateQuantity);
const _job2 = schedule.scheduleJob(rule, exports.updateBoxQuantity);
const exportReports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");
    // Define column headers based on JSON keys
    worksheet.addRow(reportHeaders);
    const startDate = new Date("2023-10-04 00:00:00.000Z");
    const endDate = new Date("2023-10-04 23:59:59.999Z");
    const yesterdayStart = new Date(startDate.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayEnd = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
    const compiledOrders = yield Order_1.default.aggregate([
        {
            $match: {
                transactionDate: {
                    $gte: startDate,
                    $lte: endDate, // Less than the end date (start of the next day)
                },
                orderType: { $in: ["Dine-In", "Take-Out"] },
            },
        },
        {
            $unwind: "$products",
        },
        {
            $lookup: {
                from: "productss",
                localField: "products.product",
                foreignField: "_id",
                as: "productInfo",
            },
        },
        {
            $unwind: "$productInfo",
        },
        {
            $lookup: {
                from: "categories",
                localField: "productInfo.category",
                foreignField: "_id",
                as: "categoryInfo",
            },
        },
        {
            $unwind: "$categoryInfo",
        },
        {
            $group: {
                _id: {
                    product: "$products.product",
                    productName: "$productInfo.name",
                    productCode: "$productInfo.code",
                    category: "$categoryInfo.name",
                },
                totalQuantity: { $sum: "$products.quantity" },
                totalPrice: {
                    $sum: { $multiply: ["$products.quantity", "$products.price"] },
                },
            },
        },
        {
            $project: {
                _id: 0,
                product: "$_id.product",
                productName: "$_id.productName",
                productCode: "$_id.productCode",
                category: "$_id.category",
                totalQuantity: 1,
                totalPrice: 1,
            },
        },
    ]);
    const allProducts = yield Product_1.default.find({}).populate("category", "name");
    const quantityDocuments = yield Quantity_1.default.find({
        date: {
            $gte: yesterdayStart,
            $lte: yesterdayEnd,
        },
    });
    const compiledOrdersMap = new Map();
    const priceMap = new Map();
    const previousQuantityMap = new Map(); // Map to store previous quantities
    quantityDocuments.forEach((quantityDoc) => {
        quantityDoc.products.forEach((productItem) => {
            const key = productItem.product.toString();
            const existingPreviousQuantity = previousQuantityMap.get(key) || 0;
            previousQuantityMap.set(key, existingPreviousQuantity + productItem.quantity);
            // Assuming there's a 'price' field in productItem
            // You can modify this if your data structure is different
            const currentPrice = productItem.price || 0;
            priceMap.set(key, currentPrice);
        });
    });
    // Iterate through compiledOrders and populate compiledOrdersMap
    compiledOrders.forEach((order) => {
        const key = order.product.toString();
        compiledOrdersMap.set(key, order);
    });
    const mergedData = allProducts.map((product) => {
        const key = product._id.toString();
        const compiledOrder = compiledOrdersMap.get(key);
        const previousQuantity = previousQuantityMap.get(key) || 0;
        const currentPrice = priceMap.get(key) || 0;
        if (compiledOrder) {
            // Use compiled order data and add previousQuantity and currentPrice
            return {
                totalQuantity: compiledOrder.totalQuantity,
                totalPrice: compiledOrder.totalPrice,
                product: compiledOrder.product,
                productName: compiledOrder.productName,
                productCode: compiledOrder.productCode,
                category: compiledOrder.category,
                previousQuantity: previousQuantity,
                currentPrice: currentPrice,
            };
        }
        else {
            return {
                totalQuantity: 0,
                totalPrice: 0,
                product: product._id,
                productName: product.name,
                productCode: product.code,
                category: typeof product.category === "string"
                    ? product.category
                    : product.category.name,
                previousQuantity: previousQuantity || product.quantity,
                currentPrice: currentPrice || product.price,
            };
        }
    });
    let lastCategory = "";
    const categorySet = new Set();
    // Add data from JSON to the worksheet
    mergedData.forEach((record) => {
        // Check if the category has changed
        if (record.category !== lastCategory && !categorySet.has(record.category)) {
            // Insert a new row with the category name
            worksheet.addRow([record.category, "", "", "", "", "", ""]); // Change the column index as needed
            // Format the category row
            const categoryRow = worksheet.lastRow;
            formatCategoryRow(categoryRow);
            // Update the lastCategory variable
            lastCategory = record.category;
            categorySet.add(record.category);
        }
        // Add the product data
        worksheet.addRow([
            record.productName,
            record.currentPrice,
            record.previousQuantity,
            record.previousQuantity - record.totalQuantity,
            "",
            record.totalQuantity,
            record.totalPrice,
        ]);
    });
    function formatCategoryRow(row) {
        // Apply formatting to the category row
        row.eachCell((cell) => {
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "000000" }, // Black background color
            };
            cell.font = {
                color: { argb: "FFFFFF" },
                bold: true,
            };
        });
    }
    const columnA = worksheet.getColumn("A");
    columnA.width = 20;
    worksheet.addRow([]);
    const totalSales = worksheet.addRow([
        "Total Sales",
        mergedData.reduce((total, currentValue) => total + currentValue.totalPrice, 0),
    ]);
    totalSales.eachCell((cell) => {
        cell.font = {
            size: 15,
            bold: true,
        };
    });
    totalSales.height = 50;
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow([]);
    const row = worksheet.addRow(["BOXES", "STARTING"]);
    // Merge the "Releasing" column cells (from cell C1 to cell F1)
    worksheet.mergeCells(`C${row.number}:F${row.number}`);
    row.getCell(3).value = "RELEASING"; // Set the value for the merged cell
    row.getCell(7).value = "ENDING";
    worksheet.addRow(["", "", "P", "C", "B", "L/D"]);
    const Boxes = yield Box_1.default.find({
        name: { $in: ["Meal", "Kasalo", "Pulutan", "Handaan", "Fiesta"] },
    });
    const boxQuantities = yield Order_1.default.aggregate([
        {
            $match: {
                transactionDate: {
                    $gte: startDate,
                    $lte: endDate, // Less than the end date (start of the next day)
                },
            },
        },
        {
            $unwind: "$products",
        },
        {
            $match: {
                "products.box": { $in: Boxes.map((b) => b._id) },
            },
        },
        {
            $lookup: {
                from: "boxes",
                localField: "products.box",
                foreignField: "_id",
                as: "boxInfo",
            },
        },
        {
            $unwind: "$boxInfo",
        },
        {
            $lookup: {
                from: "productss",
                localField: "products.product",
                foreignField: "_id",
                as: "productsInfo",
            },
        },
        {
            $unwind: "$productsInfo",
        },
        {
            $group: {
                _id: "$products.box",
                box: {
                    $first: {
                        name: "$boxInfo.name",
                    },
                },
                totalQuantity: { $sum: "$products.quantity" },
                productQuantities: {
                    $push: {
                        product: "$productsInfo.name",
                        quantity: "$products.quantity",
                    },
                },
            },
        },
        {
            $unwind: "$productQuantities",
        },
        {
            $group: {
                _id: {
                    box: "$_id",
                    product: "$productQuantities.product",
                },
                box: { $first: "$box" },
                totalQuantity: { $first: "$totalQuantity" },
                productQuantity: { $sum: "$productQuantities.quantity" },
            },
        },
        {
            $group: {
                _id: "$_id.box",
                box: { $first: "$box" },
                totalQuantity: { $first: "$totalQuantity" },
                productQuantities: {
                    $push: {
                        product: "$_id.product",
                        quantity: "$productQuantity",
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                box: "$box.name",
                totalQuantity: 1,
                productQuantities: 1,
            },
        },
    ]);
    const boxQuantity = yield BoxQuantity_1.default.aggregate([
        {
            $match: {
                date: {
                    $gte: yesterdayStart,
                    $lte: yesterdayEnd,
                },
            },
        },
        {
            $unwind: "$boxes",
        },
        {
            $lookup: {
                from: "boxes",
                localField: "boxes.box",
                foreignField: "_id",
                as: "boxInfo",
            },
        },
        {
            $unwind: "$boxInfo",
        },
        {
            $group: {
                _id: {
                    box: "$boxInfo.name",
                },
                quantity: { $sum: "$boxes.quantity" },
            },
        },
        {
            $project: {
                _id: 0,
                box: "$_id.box",
                quantity: 1,
            },
        },
    ]);
    console.log(boxQuantity);
    // Create a mapping of boxes from array2 to their quantities using a different variable name
    const boxToQuantityMap = {};
    for (const item of boxQuantity) {
        const { box, quantity } = item;
        boxToQuantityMap[box] = { prevQuantity: quantity };
    }
    const desiredOrder = ["Meal", "Kasalo", "Pulutan", "Handaan", "Fiesta"];
    // Sort array1 based on the desired order
    // boxQuantities.sort((a, b) => {
    //   const indexA = desiredOrder.indexOf(a.box);
    //   const indexB = desiredOrder.indexOf(b.box);
    //   return indexA - indexB;
    // });
    // Loop through array1 and update quantities based on array2
    for (const item of boxQuantities) {
        const { box } = item;
        if (boxToQuantityMap.hasOwnProperty(box)) {
            item.prevQuantity = boxToQuantityMap[box].prevQuantity;
            delete boxToQuantityMap[box]; // Remove the box from the mapping
        }
        else {
            // If the box doesn't exist in array2, create an empty prevQuantity
            item.prevQuantity = 0;
        }
    }
    // Add any remaining boxes from array2 to array1
    for (const box in boxToQuantityMap) {
        boxQuantities.push({
            totalQuantity: 0,
            productQuantities: [],
            box: box,
            prevQuantity: boxToQuantityMap[box].prevQuantity,
        });
    }
    // Output the updated array1
    // console.log(boxQuantities[0]);
    boxQuantities.sort((a, b) => {
        const indexA = desiredOrder.indexOf(a.box);
        const indexB = desiredOrder.indexOf(b.box);
        return indexA - indexB;
    });
    boxQuantities.forEach((q) => {
        var _a, _b, _c, _d, _e;
        const pork = ((_a = q === null || q === void 0 ? void 0 : q.productQuantities.filter((p) => p.product.includes("Pork"))[0]) === null || _a === void 0 ? void 0 : _a.quantity) || 0;
        const chicken = ((_b = q === null || q === void 0 ? void 0 : q.productQuantities.filter((c) => c.product.includes("Chicken"))[0]) === null || _b === void 0 ? void 0 : _b.quantity) || 0;
        const bangus = ((_c = q === null || q === void 0 ? void 0 : q.productQuantities.filter((b) => b.product.includes("Bangus"))[0]) === null || _c === void 0 ? void 0 : _c.quantity) || 0;
        const ld = (((_d = q === null || q === void 0 ? void 0 : q.productQuantities.filter((b) => b.product.includes("Lumpia"))[0]) === null || _d === void 0 ? void 0 : _d.quantity) || 0) +
            (((_e = q === null || q === void 0 ? void 0 : q.productQuantities.filter((b) => b.product.includes("Dynamite"))[0]) === null || _e === void 0 ? void 0 : _e.quantity) || 0);
        worksheet.addRow([
            q.box,
            q.prevQuantity,
            pork,
            chicken,
            bangus,
            ld,
            q.prevQuantity - q.totalQuantity,
        ]);
    });
    // Set response headers for Excel file download
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=exported-data.xlsx");
    // Stream the Excel workbook to the response
    workbook.xlsx
        .write(res)
        .then(() => {
        res.end();
    })
        .catch((error) => {
        console.error(error);
        res.status(500).send("Error exporting data to Excel");
    });
});
exports.exportReports = exportReports;
