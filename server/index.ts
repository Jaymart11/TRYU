import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose, { Schema, Document, model } from "mongoose";

dotenv.config();

// Define the Product interface
interface IProduct extends Document {
  name: string;
  category: string;
  subcategories: Array<{
    name: string;
    active: boolean;
    quantity: number;
    price: number;
  }>;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create a mongoose schema for the Product collection
const productSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  subcategories: [
    {
      name: { type: String, required: true },
      active: { type: Boolean, default: true },
      quantity: { type: Number, default: 0 },
      price: { type: Number, default: 0 },
    },
  ],
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create a mongoose model for the Product collection
const Product = model<IProduct>("Product", productSchema);

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/products", async (req: Request, res: Response) => {
  try {
    const productData: IProduct = req.body;
    console.log("Received product data:", productData);

    const product = new Product(productData);
    const savedProduct = await product.save();
    console.log("Saved product:", savedProduct);

    res.json(savedProduct);
  } catch (error) {
    console.error("Error inserting product:", error);
    res.status(500).json({ error: "Error inserting product" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Inventory")
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));
