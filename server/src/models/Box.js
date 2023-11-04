"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// import { IQuantity } from "../../shared/interface/IQuantity";
const boxSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    quantity: { type: Number },
}, { timestamps: true });
const Box = (0, mongoose_1.model)("Box", boxSchema, "boxes");
exports.default = Box;
