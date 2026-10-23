import {
  insertProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} from "../models/product.model.js";
import { uploadImage } from "../services/imagekit.services.js";

async function getImageUrl(request, currentImage = null) {
  if (request.file) {
    const image = await uploadImage(
      request.file.buffer.toString("base64"),
      request.file.originalname,
    );
    return image.url;
  }

  if (typeof request.body.image_url === "string") {
    return request.body.image_url.trim() || null;
  }

  return currentImage;
}

export async function createProduct(request, response) {
  try {
    const { name, description, price, stock, category } = request.body;
    const product = await insertProduct(request.user.userId, {
      name: name.trim(),
      description: description?.trim() || null,
      price: Number(price),
      stock: Number(stock),
      image_url: await getImageUrl(request),
      category: category?.trim() || null,
    });

    return response.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error.message);
    return response.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
}

export async function handleGetAllProducts(request, response) {
  try {
    const products = await getAllProducts(request.user.userId);
    return response.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Fetch products error:", error.message);
    return response.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
}

export async function handleGetProductById(request, response) {
  try {
    const { id } = request.params;

    if (!/^\d+$/.test(id) || Number(id) < 1) {
      return response.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await getProductById(request.user.userId, id);

    if (!product) {
      return response.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return response.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Fetch product error:", error.message);
    return response.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
}

export async function handleUpdateProduct(request, response) {
  try {
    const { id } = request.params;

    if (!/^\d+$/.test(id) || Number(id) < 1) {
      return response.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const { name, price, stock, description, category } = request.body;
    const currentProduct = await getProductById(request.user.userId, id);

    if (!currentProduct) {
      return response.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = await updateProductById(request.user.userId, id, {
      name: name.trim(),
      description: description?.trim() || null,
      price: Number(price),
      stock: Number(stock),
      image_url: await getImageUrl(request, currentProduct.image_url),
      category: category?.trim() || null,
    });

    return response.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error.message);
    return response.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
}

export async function handleDeleteProductById(request, response) {
  try {
    const { id } = request.params;

    if (!/^\d+$/.test(id) || Number(id) < 1) {
      return response.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await deleteProductById(request.user.userId, id);

    if (!product) {
      return response.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return response.json({
      success: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    console.error("Delete product error:", error.message);
    return response.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
}
