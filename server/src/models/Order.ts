import { Schema, model } from "mongoose";
import { IOrder } from "../../shared/interface/IOrder";

const orderSchema = new Schema(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        box: { type: Schema.Types.ObjectId, ref: "Box", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        less: [
          {
            product: {
              type: Schema.Types.ObjectId,
              ref: "Product",
              required: true,
            },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
          },
        ],
      },
    ],
    cashier: { type: Schema.Types.ObjectId, ref: "User", required: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["Cash", "GCash"], required: true },
    orderType: {
      type: String,
      enum: ["Dine-In", "Take-Out", "Grab", "Food Panda"],
      required: true,
    },
    discount: { type: Number },
  },
  { timestamps: true }
);

const Order = model<IOrder>("Order", orderSchema, "order");

export default Order;
