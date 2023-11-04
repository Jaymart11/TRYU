import { Schema, model } from "mongoose";
import { ICategory } from "../../shared/interface/ICategory";

const categorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);
const Category = model<ICategory>("Category", categorySchema, "categories");

export default Category;
