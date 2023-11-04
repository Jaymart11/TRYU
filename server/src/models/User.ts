import { Schema, model } from "mongoose";
import { IUser } from "../../shared/interface/IUser";

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Cashier", "Manager"], required: true },
  },
  { timestamps: true }
);
const User = model<IUser>("User", userSchema, "user");

export default User;
