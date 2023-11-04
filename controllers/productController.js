import asyncHandler from "../middleware/asyncHandler.js";
import db from "../config/db.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const [products] = await db.query("SELECT * FROM Products");
  console.log(products);
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const [rows] = await db.query("SELECT * FROM Products WHERE ProductID = ?", [
    req.params.id,
  ]);
  const product = rows[0];
  if (product) {
    return res.json(product);
  }
  res.status(404);
  throw new Error("Resource not found");
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  throw new Error("createProduct function not implemented");
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  throw new Error("updateProduct function not implemented");
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  throw new Error("deleteProduct function not implemented");
});

// @desc    Create new review for a product
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  throw new Error("createProductReview function not implemented");
});

// @desc    Get top products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  throw new Error("getTopProducts function not implemented");
});

// Export all functions
export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
};
