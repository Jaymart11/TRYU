import { Schema } from "mongoose";

export interface IBoxQuantity extends Document {
  boxes: Array<{
    box: Schema.Types.ObjectId;
    quantity: number;
  }>;
  createdAt: string;
  updatedAt: string;
}
