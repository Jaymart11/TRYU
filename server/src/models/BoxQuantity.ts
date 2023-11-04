import mongoose, { Schema, model } from "mongoose";
import { IBoxQuantity } from "../../shared/interface/IBoxQuantity";

const boxQuantitySchema: Schema = new Schema(
  {
    boxes: [
      {
        box: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Box",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);
const BoxQuantity = model<IBoxQuantity>(
  "BoxQuantity",
  boxQuantitySchema,
  "boxQuantity"
);

export default BoxQuantity;
