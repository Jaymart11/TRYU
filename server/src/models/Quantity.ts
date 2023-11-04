import mongoose, { Schema, model } from "mongoose";
import { IQuantity } from "../../shared/interface/IQuantity";

const quantitySchema: Schema = new Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);
const Quantity = model<IQuantity>("Quantity", quantitySchema, "quantity");

export default Quantity;
