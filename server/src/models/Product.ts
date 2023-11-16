import { Schema, model } from "mongoose";
import { IProduct } from "../../shared/interface/IProduct";
import Category from "./Category";
import Box from "./Box";

const productSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: Category, required: true },
    box: { type: Schema.Types.ObjectId, ref: Box },
    active: { type: Boolean, default: true },
    quantity: { type: Number },
    price: { type: Number, required: true },
    combo: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
    withDrink: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const Product = model<IProduct>("Product", productSchema, "products");

export default Product;
