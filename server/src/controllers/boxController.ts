import { Request, Response } from "express";
import { IBox } from "../../shared/interface/IBox";
import Box from "../models/Box";

export const fetchBox = async (req: Request, res: Response) => {
  try {
    const box = await Box.find({});
    res.json(box);
  } catch (error) {
    console.error("Error fetching box:", error);
    res.status(500).json({ error: "Error fetching box" });
  }
};

export const getSingleBox = async (req: Request, res: Response) => {
  const boxId: string = req.params.id;

  try {
    const box = await Box.findById(boxId);
    if (!box) {
      return res.status(404).json({ error: "Box not found" });
    }
    res.json(box);
  } catch (error) {
    console.error("Error retrieving box:", error);
    res.status(500).json({ error: "Error retrieving box" });
  }
};

export const createBox = async (req: Request, res: Response) => {
  try {
    const boxData: IBox = req.body;
    const box = new Box(boxData);
    const savedBox = await box.save();

    res.json(savedBox);
  } catch (error) {
    console.error("Error inserting box:", error);
    res.status(500).json({ error: "Error inserting box" });
  }
};

export const updateBox = async (req: Request, res: Response) => {
  try {
    const boxId = req.params.id;
    const { name, quantity }: IBox = req.body;

    if (!name) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const existingBox = await Box.findById(boxId);
    if (!existingBox) {
      return res.status(404).json({ message: "Box not found" });
    }

    if (name) existingBox.name = name;
    if (quantity) existingBox.quantity = quantity;

    await existingBox.save();

    return res.status(200).json(existingBox);
  } catch (error) {
    console.error("Error editing box:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBox = async (req: Request, res: Response) => {
  const boxId: string = req.params.id;

  try {
    const deletedBox = await Box.findByIdAndDelete(boxId);

    if (!deletedBox) {
      return res.status(404).json({ error: "Box not found" });
    }

    res.json({ message: "Box deleted successfully" });
  } catch (error) {
    console.error("Error deleting box:", error);
    res.status(500).json({ error: "Error deleting box" });
  }
};
