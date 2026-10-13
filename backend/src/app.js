import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import productRoutes from "../routes/product.routes.js";
import authRoutes from "../routes/auth.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

export default app;
