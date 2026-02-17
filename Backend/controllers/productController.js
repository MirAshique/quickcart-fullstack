import mongoose from "mongoose";
import Product from "../models/Product.js";

/* ======================================================
   📦 GET ALL PRODUCTS
====================================================== */
export const getAllProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const {
      search,
      mainCategory,
      subCategory,
      brand,
      minPrice,
      maxPrice,
      sort,
      inStock
    } = req.query;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (mainCategory) query.mainCategory = mainCategory;
    if (subCategory) query.subCategory = subCategory;
    if (brand) query.brand = brand;

    if (minPrice && maxPrice) {
      query.price = {
        $gte: Number(minPrice),
        $lte: Number(maxPrice)
      };
    }

    if (inStock === "true") {
      query.stock = { $gt: 0 };
    }

    let sortOption = { createdAt: -1 };

    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "rating_desc") sortOption = { rating: -1 };

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ======================================================
   📄 GET SINGLE PRODUCT
====================================================== */
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ======================================================
   ➕ ADD PRODUCT (Admin)
====================================================== */
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      mainCategory,
      subCategory,
      brand,
      stock,
      images,
      tags
    } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      mainCategory,
      subCategory,
      brand,
      stock,
      images,
      tags
    });

    res.status(201).json({
      success: true,
      product
    });

  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ======================================================
   ✏ UPDATE PRODUCT (Admin)
====================================================== */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    Object.assign(product, req.body);

    const updatedProduct = await product.save();

    res.json({
      success: true,
      product: updatedProduct
    });

  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ======================================================
   ❌ DELETE PRODUCT (Admin)
====================================================== */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
