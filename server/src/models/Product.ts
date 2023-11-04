import { Schema, model } from "mongoose";
import { IProduct } from "../../shared/interface/IProduct";
import Category from "./Category";
import Box from "./Box";

const productSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: Category, required: true },
    box: { type: Schema.Types.ObjectId, ref: Box, required: true },
    active: { type: Boolean, default: true },
    quantity: { type: Number },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);
const Product = model<IProduct>("Product", productSchema, "productss");

export default Product;
