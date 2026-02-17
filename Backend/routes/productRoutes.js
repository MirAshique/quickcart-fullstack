import express from "express";
import {
  getAllProducts,
  getSingleProduct,
  addProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ===== Public Routes =====

// Get all products (with pagination, search, filters)
router.get("/", getAllProducts);

// Get single product
router.get("/:id", getSingleProduct);


// ===== Admin Routes =====

// Create product
router.post("/", protect, adminOnly, addProduct);

// Update product
router.put("/:id", protect, adminOnly, updateProduct);

// Delete product
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
