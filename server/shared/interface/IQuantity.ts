import { Schema } from "mongoose";

export interface IQuantity extends Document {
  products: Array<{
    product: Schema.Types.ObjectId;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
  updatedAt: string;
}
