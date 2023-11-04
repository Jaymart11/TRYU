import { Request, Response } from "express";
import Order from "../models/Order";
import Product from "../models/Product";
import Box from "../models/Box";

export const fetchOrder = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch orders." });
  }
};
export const fetchSingleOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch the order." });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);

    for (const orderProduct of newOrder.products) {
      const product = await Product.findById(orderProduct.product);

      if (!product) {
        throw new Error(`Product with ID ${orderProduct.product} not found.`);
      }

      const box = await Box.findById(product.box);

      if (!box) {
        throw new Error(`Box with ID ${product.box} not found.`);
      }

      if (
        product.quantity &&
        (orderProduct.less === undefined || orderProduct.less?.length === 0)
      ) {
        product.quantity -= orderProduct.quantity;
      } else if (orderProduct.less) {
        for (const prod of orderProduct.less) {
          const lessProduct = await Product.findById(prod.product);

          if (lessProduct && lessProduct.quantity) {
            lessProduct.quantity -= prod.quantity;
            await lessProduct.save();
          }
        }
      }

      box.quantity -= orderProduct.quantity;
      await product.save();
      await box.save();
    }
  } catch (error) {
    res.status(400).json({ error: "Could not create the order." });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      req.body,
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found." });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: "Could not update the order." });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);
    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found." });
    }
    res.status(204).send(); // No content on successful deletion
  } catch (error) {
    res.status(500).json({ error: "Could not delete the order." });
  }
};
