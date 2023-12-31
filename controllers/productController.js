import asyncHandler from "../middleware/asyncHandler.js";
import db from "../config/db.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const [products] = await db.query("SELECT * FROM Products");
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const [rows] = await db.query("SELECT * FROM Products WHERE id = ?", [
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
  const { name, image, brand, category, description } = req.body;
  const [rows] = await db.query("Select * from Products where name = ?", [
    name,
  ]);
  if (rows.length) throw new Error("Product already exists");
  else {
    await db.query(
      "INSERT INTO Products (name,image,brand,category,description) VALUES (?,?,?,?,?)",
      [name, image, brand, category, description]
    );
  }

  res.json(rows[0]);

  // throw new Error("createProduct function not implemented");
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const [rows] = await db.query("SELECT * FROM Products WHERE id = ?", [
    req.params.id,
  ]);
  if (!rows.length) throw new Error("Product not found");
  const { name, image, brand, category, description } = req.body;

  try {
    await db.query(
      "UPDATE Products set name = ?, image = ?, brand = ?, category = ?, description =?  WHERE id = ?",
      [name, image, brand, category, description, req.params.id]
    );

    res.json(rows[0]);
  } catch (err) {
    throw new Error("updateProduct function not complete");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  console.log(req.params.id);
  try {
    const [result] = await db.query("DELETE FROM Products WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      console.log("No product found with the specified ID.");
      throw new Error("No product found with the specified ID.");
    } else {
      console.log("Product deleted successfully.");
      res.json({ message: "Product deleted successfully." });
    }
  } catch (error) {
    console.error("Error during the delete operation:", error);
    throw new Error("deleteProduct function not complete");
  }
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
