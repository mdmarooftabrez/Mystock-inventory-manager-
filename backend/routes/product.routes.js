import express from "express";
import {
  createProduct,
  handleDeleteProductById,
  handleGetAllProducts,
  handleGetProductById,
  handleUpdateProduct,
} from "../controllers/product.controller.js";
import { validateProduct } from "../middleware/validateProduct.js";
import upload from "../middleware/uploadImage.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", handleGetAllProducts);
router.get("/:id", handleGetProductById);
router.post("/", upload.single("image"), validateProduct, createProduct);
router.put("/:id", upload.single("image"), validateProduct, handleUpdateProduct);
router.delete("/:id", handleDeleteProductById);

export default router;
