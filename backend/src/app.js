import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import productRoutes from "../routes/product.routes.js";
import authRoutes from "../routes/auth.routes.js";
import { apiRateLimit } from "../middleware/rateLimit.js";

const app = express();

app.set("trust proxy", process.env.NODE_ENV === "production" ? 1 : false);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api", apiRateLimit);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

export default app;
