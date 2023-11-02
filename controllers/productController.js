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

export { getProducts, getProductById };
