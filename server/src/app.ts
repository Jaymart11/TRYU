import express, { Express } from "express";
import productRoutes from "./routes/productRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import userRoutes from "./routes/userRoutes";
import orderRoutes from "./routes/orderRoutes";
import reportRoutes from "./routes/reportRoutes";
import boxRoutes from "./routes/boxRoutes";
import expenseRoutes from "./routes/expenseRoutes";

const app: Express = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());

app.use("/products", productRoutes);
app.use("/category", categoryRoutes);
app.use("/user", userRoutes);
app.use("/order", orderRoutes);
app.use("/report", reportRoutes);
app.use("/box", boxRoutes);
app.use("/expense", expenseRoutes);

export default app;
