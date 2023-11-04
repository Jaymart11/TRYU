import { Schema } from "mongoose";
import { IUser } from "./IUser";

export interface IOrder extends Document {
  products: Array<{
    product: Schema.Types.ObjectId;
    box: Schema.Types.ObjectId;
    quantity: number;
    price: number;
    less?: Array<{
      product: Schema.Types.ObjectId;
      name: string;
      quantity: number;
    }>;
  }>;
  cashier: Schema.Types.ObjectId | IUser;
  totalAmount: number;
  paymentMethod: "Cash";
  orderType: "Dine-In" | "Take-Out" | "Grab" | "Food Panda";
  discount?: number;
  createdAt: string;
  updatedAt: string;
}
