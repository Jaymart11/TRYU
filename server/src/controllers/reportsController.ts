import Box from "../models/Box";
import BoxQuantity from "../models/BoxQuantity";
import Category from "../models/Category";
import Order from "../models/Order";
import Product from "../models/Product";
import Quantity from "../models/Quantity";
const schedule = require("node-schedule");
import * as ExcelJS from "exceljs";

const reportHeaders = [
  "ITEMS",
  "PRICE",
  "STARTING",
  "ENDING",
  "LESS P/H/F",
  "RELEASING",
  "SALES AMOUNT",
];

export const updateQuantity = async (req: any, res: any) => {
  try {
    // Step 1: Get the latest quantity for each product
    const products = await Product.find();

    const newQuantity = new Quantity({
      products: products.map(({ quantity, _id, price }) => ({
        product: _id,
        quantity,
        price,
      })),
    });
    await newQuantity.save();
  } catch (error) {
    console.error("Error creating quantities:", error);
    throw error;
  }
};

export const updateBoxQuantity = async (req: any, res: any) => {
  try {
    // Step 1: Get the latest quantity for each product
    const box = await Box.find();

    const newQuantity = new BoxQuantity({
      boxes: box.map(({ quantity, _id }) => ({
        box: _id,
        quantity,
      })),
    });
    await newQuantity.save();
  } catch (error) {
    console.error("Error creating quantities:", error);
    throw error;
  }
};

// Schedule the task to run at 12 AM every day
const rule = new schedule.RecurrenceRule();
rule.hour = 23;
rule.minute = 59;
rule.second = 59;

const _job = schedule.scheduleJob(rule, updateQuantity);
const _job2 = schedule.scheduleJob(rule, updateBoxQuantity);

export const exportReports = async (req: any, res: any) => {
  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  // Define column headers based on JSON keys
  worksheet.addRow(reportHeaders);

  const startDate = new Date("2023-11-07 00:00:00.000Z");
  const endDate = new Date("2023-11-07 23:59:59.999Z");

  const yesterdayStart = new Date(startDate.getTime() - 24 * 60 * 60 * 1000);
  const yesterdayEnd = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);

  const queryOrders = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate, // Greater than or equal to the start date (start of the day)
          $lte: endDate, // Less than the end date (start of the next day)
        },
        orderType: { $in: ["Dine-In", "Take-Out"] },
      },
    },
    {
      $unwind: "$products",
    },
    {
      $lookup: {
        from: "productss", // Use the actual collection name
        localField: "products.product",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    {
      $unwind: "$productInfo",
    },
    {
      $lookup: {
        from: "categories", // Assuming the collection name is "categories"
        localField: "productInfo.category", // Reference to category document
        foreignField: "_id", // Assuming category document has _id field
        as: "categoryInfo",
      },
    },
    {
      $unwind: "$categoryInfo",
    },
    {
      $group: {
        _id: {
          product: "$products.product",
          productName: "$productInfo.name",
          productCode: "$productInfo.code",
          category: "$categoryInfo.name",
        },
        totalQuantity: { $sum: "$products.quantity" },
        totalPrice: {
          $sum: { $multiply: ["$products.quantity", "$products.price"] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        product: "$_id.product",
        productName: "$_id.productName",
        productCode: "$_id.productCode",
        category: "$_id.category",
        totalQuantity: 1,
        totalPrice: 1,
      },
    },
  ]);

  const compiledLess = await Order.aggregate([
    { $unwind: "$products" }, // Deconstruct the 'products' array
    { $unwind: "$products.less" }, // Deconstruct the 'less' array
    {
      $group: {
        _id: {
          productName: "$products.less.name",
          productID: "$products.less.product",
        },
        lessQuantity: { $sum: "$products.less.quantity" },
      },
    },
    {
      $project: {
        _id: 0,
        product: "$_id.productID",
        productName: "$_id.productName",
        lessQuantity: 1,
      },
    },
  ]);

  const compiledOrders = queryOrders.map((item2) => {
    const matchingItem = compiledLess.find(
      (item1) => item1.productName === item2.productName
    );
    return { ...item2, ...matchingItem };
  });

  // console.log(combinedArray);

  const allProducts = await Product.find({}).populate("category", "name");

  const quantityDocuments = await Quantity.find({
    createdAt: {
      $gte: yesterdayStart,
      $lte: yesterdayEnd,
    },
  });

  const compiledOrdersMap = new Map();
  const priceMap = new Map();
  const previousQuantityMap = new Map(); // Map to store previous quantities

  quantityDocuments.forEach((quantityDoc) => {
    quantityDoc.products.forEach((productItem) => {
      const key = productItem.product.toString();
      const existingPreviousQuantity = previousQuantityMap.get(key) || 0;
      previousQuantityMap.set(
        key,
        existingPreviousQuantity + productItem.quantity
      );

      // Assuming there's a 'price' field in productItem
      // You can modify this if your data structure is different
      const currentPrice = productItem.price || 0;
      priceMap.set(key, currentPrice);
    });
  });

  // Iterate through compiledOrders and populate compiledOrdersMap
  compiledOrders.forEach((order) => {
    const key = order.product.toString();
    compiledOrdersMap.set(key, order);
  });

  const mergedData = allProducts.map((product) => {
    const key = product._id.toString();
    const compiledOrder = compiledOrdersMap.get(key);
    const previousQuantity = previousQuantityMap.get(key) || 0;
    const currentPrice = priceMap.get(key) || 0;

    if (compiledOrder) {
      // Use compiled order data and add previousQuantity and currentPrice
      return {
        totalQuantity: compiledOrder.totalQuantity,
        totalPrice: compiledOrder.totalPrice,
        product: compiledOrder.product,
        productName: compiledOrder.productName,
        productCode: compiledOrder.productCode,
        category: compiledOrder.category,
        previousQuantity: previousQuantity,
        currentPrice: currentPrice,
        lessQuantity: compiledOrder.lessQuantity,
      };
    } else {
      return {
        totalQuantity: 0,
        totalPrice: 0,
        product: product._id,
        productName: product.name,
        productCode: product.code,
        // lessQuantity: compiledOrder.lessQuantity,
        category:
          typeof product.category === "string"
            ? product.category
            : product.category.name,
        previousQuantity: previousQuantity || product.quantity,
        currentPrice: currentPrice || product.price,
      };
    }
  });
  let lastCategory = "";
  const categorySet = new Set();

  console.log(mergedData);

  // Add data from JSON to the worksheet
  mergedData
    .sort((a, b) => {
      return a.category.localeCompare(b.category);
    })
    .forEach((record) => {
      // Check if the category has changed
      // console.log(record.category);
      if (
        record.category !== lastCategory &&
        !categorySet.has(record.category)
      ) {
        // Insert a new row with the category name
        worksheet.addRow([record.category, "", "", "", "", "", ""]); // Change the column index as needed

        // Format the category row
        const categoryRow: any = worksheet.lastRow;
        formatCategoryRow(categoryRow);

        // Update the lastCategory variable
        lastCategory = record.category;

        categorySet.add(record.category);
      }
      // console.log(record.productName);
      // Add the product data
      worksheet.addRow([
        record.productName,
        record.currentPrice,
        record.previousQuantity || "",
        record.previousQuantity - record.totalQuantity > 0
          ? (record.previousQuantity || 0) -
            record.totalQuantity -
            (record.lessQuantity || 0)
          : "",
        record.lessQuantity || "",
        record.totalQuantity || "",
        record.totalPrice || "",
      ]);
    });

  function formatCategoryRow(row: ExcelJS.Row) {
    // Apply formatting to the category row
    row.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "000000" }, // Black background color
      };
      cell.font = {
        color: { argb: "FFFFFF" }, // White text color
        bold: true,
      };
    });
  }

  const columnA = worksheet.getColumn("A");
  columnA.width = 20;

  worksheet.addRow([]);

  const totalSales = worksheet.addRow([
    "Total Sales",
    mergedData.reduce(
      (total, currentValue) => total + currentValue.totalPrice,
      0
    ),
  ]);

  totalSales.eachCell((cell) => {
    cell.font = {
      size: 15, // White text color
      bold: true,
    };
  });

  totalSales.height = 50;

  worksheet.addRow([]);
  worksheet.addRow([]);
  worksheet.addRow([]);
  const row = worksheet.addRow(["BOXES", "STARTING"]);

  // Merge the "Releasing" column cells (from cell C1 to cell F1)
  worksheet.mergeCells(`C${row.number}:F${row.number}`);
  row.getCell(3).value = "RELEASING"; // Set the value for the merged cell
  row.getCell(7).value = "ENDING";

  worksheet.addRow(["", "", "P", "C", "B", "L/D"]);

  const Boxes = await Box.find({
    name: { $in: ["Meal", "Kasalo", "Pulutan", "Handaan", "Fiesta"] },
  });

  const boxQuantities = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate, // Greater than or equal to the start date (start of the day)
          $lte: endDate, // Less than the end date (start of the next day)
        },
      },
    },
    {
      $unwind: "$products",
    },
    {
      $match: {
        "products.box": { $in: Boxes.map((b) => b._id) },
      },
    },
    {
      $lookup: {
        from: "boxes",
        localField: "products.box",
        foreignField: "_id",
        as: "boxInfo",
      },
    },
    {
      $unwind: "$boxInfo",
    },
    {
      $lookup: {
        from: "productss",
        localField: "products.product",
        foreignField: "_id",
        as: "productsInfo",
      },
    },
    {
      $unwind: "$productsInfo",
    },
    {
      $group: {
        _id: "$products.box",
        box: {
          $first: {
            name: "$boxInfo.name",
          },
        },
        totalQuantity: { $sum: "$products.quantity" },
        productQuantities: {
          $push: {
            product: "$productsInfo.name",
            quantity: "$products.quantity",
          },
        },
      },
    },
    {
      $unwind: "$productQuantities",
    },
    {
      $group: {
        _id: {
          box: "$_id",
          product: "$productQuantities.product",
        },
        box: { $first: "$box" },
        totalQuantity: { $first: "$totalQuantity" },
        productQuantity: { $sum: "$productQuantities.quantity" },
      },
    },
    {
      $group: {
        _id: "$_id.box",
        box: { $first: "$box" },
        totalQuantity: { $first: "$totalQuantity" },
        productQuantities: {
          $push: {
            product: "$_id.product",
            quantity: "$productQuantity",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        box: "$box.name",
        totalQuantity: 1,
        productQuantities: 1,
      },
    },
  ]);

  const boxQuantity = await BoxQuantity.aggregate([
    {
      $match: {
        createdAt: {
          $gte: yesterdayStart,
          $lte: yesterdayEnd,
        },
      },
    },
    {
      $unwind: "$boxes",
    },
    {
      $lookup: {
        from: "boxes",
        localField: "boxes.box",
        foreignField: "_id",
        as: "boxInfo",
      },
    },
    {
      $unwind: "$boxInfo",
    },
    {
      $group: {
        _id: {
          box: "$boxInfo.name",
        },
        quantity: { $sum: "$boxes.quantity" },
      },
    },
    {
      $project: {
        _id: 0,
        box: "$_id.box",
        quantity: 1,
      },
    },
  ]);

  // Create a mapping of boxes from array2 to their quantities using a different variable name
  const boxToQuantityMap: { [key: string]: { prevQuantity: number } } = {};
  for (const item of boxQuantity) {
    const { box, quantity } = item;
    boxToQuantityMap[box] = { prevQuantity: quantity };
  }

  const desiredOrder = ["Meal", "Kasalo", "Pulutan", "Handaan", "Fiesta"];

  // Sort array1 based on the desired order
  // boxQuantities.sort((a, b) => {
  //   const indexA = desiredOrder.indexOf(a.box);
  //   const indexB = desiredOrder.indexOf(b.box);
  //   return indexA - indexB;
  // });

  // Loop through array1 and update quantities based on array2
  for (const item of boxQuantities) {
    const { box } = item;
    if (boxToQuantityMap.hasOwnProperty(box)) {
      item.prevQuantity = boxToQuantityMap[box].prevQuantity;
      delete boxToQuantityMap[box]; // Remove the box from the mapping
    } else {
      // If the box doesn't exist in array2, create an empty prevQuantity
      item.prevQuantity = 0;
    }
  }

  // Add any remaining boxes from array2 to array1
  for (const box in boxToQuantityMap) {
    if (desiredOrder.includes(box)) {
      boxQuantities.push({
        totalQuantity: 0,
        productQuantities: [],
        box: box,
        prevQuantity: boxToQuantityMap[box].prevQuantity,
      });
    }
  }

  // Output the updated array1
  // console.log(boxQuantities[0]);

  boxQuantities.sort((a, b) => {
    const indexA = desiredOrder.indexOf(a.box);
    const indexB = desiredOrder.indexOf(b.box);
    return indexA - indexB;
  });

  boxQuantities.forEach((q) => {
    const pork =
      q?.productQuantities.filter((p: { product: string; quantity: number }) =>
        p.product.includes("Pork")
      )[0]?.quantity || 0;
    const chicken =
      q?.productQuantities.filter((c: { product: string; quantity: number }) =>
        c.product.includes("Chicken")
      )[0]?.quantity || 0;
    const bangus =
      q?.productQuantities.filter((b: { product: string; quantity: number }) =>
        b.product.includes("Bangus")
      )[0]?.quantity || 0;
    const ld =
      (q?.productQuantities.filter((b: { product: string; quantity: number }) =>
        b.product.includes("Lumpia")
      )[0]?.quantity || 0) +
      (q?.productQuantities.filter((b: { product: string; quantity: number }) =>
        b.product.includes("Dynamite")
      )[0]?.quantity || 0);

    worksheet.addRow([
      q.box,
      q.prevQuantity,
      pork,
      chicken,
      bangus,
      ld,
      q.prevQuantity - q.totalQuantity,
    ]);
  });

  // Set response headers for Excel file download
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=exported-data.xlsx"
  );

  // Stream the Excel workbook to the response
  workbook.xlsx
    .write(res)
    .then(() => {
      res.end();
    })
    .catch((error: any) => {
      console.error(error);
      res.status(500).send("Error exporting data to Excel");
    });
};
