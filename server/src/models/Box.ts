import mongoose, { Schema, model } from "mongoose";
import { IBox } from "../../shared/interface/IBox";
// import { IQuantity } from "../../shared/interface/IQuantity";

const boxSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number },
  },
  { timestamps: true }
);
const Box = model<IBox>("Box", boxSchema, "boxes");

export default Box;
