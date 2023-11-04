import mongoose, { Schema, model } from "mongoose";
import { IExpense } from "../../shared/interface/IExpense";
// import { IQuantity } from "../../shared/interface/IQuantity";

const expenseSchema: Schema = new Schema(
  {
    name: { type: String },
    product_id: { type: Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);
const Expense = model<IExpense>("Expense", expenseSchema, "expenses");

export default Expense;
