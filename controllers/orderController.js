import asyncHandler from "../middleware/asyncHandler.js";
import db from "../config/db.js";
import { calcPrices } from "../utils/calcPrices.js";
// import { verifyPayPalPayment, checkIfNewTransaction } from "../utils/paypal.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
	const { orderItems, shippingAddress, billingAddress, paymentMethod, userId } =
		req.body;

	console.log("orderItems", orderItems);

	if (orderItems && orderItems.length === 0) {
		res.status(400);
		throw new Error("No order items");
	} else {
		// Calculate prices, you need to implement the logic in calcPrices using SQL and business logic
		const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
			calcPrices(orderItems);

		console.log("itemsPrice", itemsPrice);

		const shippingAddressString = `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}`;
		const billingAddressString = `${billingAddress.address}, ${billingAddress.city}, ${billingAddress.postalCode}, ${billingAddress.country}`;
		const [orderResult] = await db.query(
			"INSERT INTO Orders (userId, shippingAddress, billingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice) VALUES (?, ?, ?, ?, ?, ?, ?,? )",
			[
				userId,
				shippingAddressString,
				billingAddressString,
				paymentMethod,
				itemsPrice,
				taxPrice,
				shippingPrice,
				totalPrice,
			]
		);

		const orderId = orderResult.insertId;

		// Insert each order item into OrderItems table
		for (const item of orderItems) {
			await db.query(
				"INSERT INTO OrderItems (name, qty, image, price, productId, orderId) VALUES (?, ?, ?, ?, ?, ?)",
				[item.name, item.qty, item.image, item.price, item.id, orderId]
			);
		}

		const [createdOrder] = await db.query("SELECT * FROM Orders WHERE id = ?", [
			orderId,
		]);

		res.status(201).json(createdOrder[0]);
	}
});

// The other controller functions would be adapted in a similar way.
// For example:

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
	const userId = req.user.id;
	const [orders] = await db.query("SELECT * FROM Orders WHERE userId = ?", [
		userId,
	]);

	for (const order of orders) {
		const [orderItems] = await db.query(
			"SELECT * FROM OrderItems WHERE orderId = ?",
			[order.id]
		);
		order.orderItems = orderItems;
	}

	res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
	const orderId = req.params.id;
	// const userId = req.user.id; // Ensure that the user requesting the order is the owner

	// First, fetch the order to check if it belongs to the user
	const [order] = await db.query("SELECT * FROM Orders WHERE id = ?", [
		orderId,
	]);

	if (order.length === 0) {
		res.status(404);
		throw new Error("Order not found");
	}

	// Then, perform a JOIN operation to get all items associated with the order
	const [orderItems] = await db.query(
		"SELECT * FROM OrderItems WHERE orderId = ?",
		[orderId]
	);

	// Combine the order and order items data
	const fullOrder = {
		...order[0],
		orderItems: orderItems,
	};

	console.log(fullOrder);

	res.json(fullOrder);
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
	console.log("cancelOrder", req.params.id);
	const orderId = req.params.id;
	const userId = req.user.id; // Assuming req.user is set after authentication
	// Fetch the order from the database
	const [order] = await db.query("SELECT * FROM Orders WHERE id = ?", [
		orderId,
	]);

	// Check if the order can be cancelled (e.g., not already shipped or cancelled)
	if (order.status === "Shipped" || order.status === "Cancelled") {
		res.status(400);
		throw new Error("Order cannot be cancelled at this stage.");
	}

	// Update the order status to 'Cancelled'
	await db.query("UPDATE Orders SET orderStatus = 'Cancelled' WHERE id = ?", [
		orderId,
	]);

	res.status(200).json({ message: "Order cancelled successfully." });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
	const [orders] = await db.query("SELECT * FROM Orders");

	// Optionally, you can join with other tables (e.g., users) to get more information
	// about each order, depending on your application's requirements.

	res.json(orders);
});

// @desc    Update order to shipped
// @route   PUT /api/orders/:id/ship
// @access  Private/Admin
const updateOrderToShipped = asyncHandler(async (req, res) => {
	const orderId = req.params.id;
	// Add Admin check here if needed

	const [order] = await db.query("SELECT * FROM Orders WHERE id = ?", [
		orderId,
	]);

	if (order.length === 0) {
		res.status(404);
		throw new Error("Order not found");
	}

	if (order[0].orderStatus !== "Placed") {
		res.status(400);
		throw new Error("Order cannot be shipped in its current state");
	}

	await db.query("UPDATE Orders SET orderStatus = 'Shipped' WHERE id = ?", [
		orderId,
	]);

	res.status(200).json({ message: "Order marked as shipped successfully." });
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
	const orderId = req.params.id;
	// Add Admin check here if needed

	const [order] = await db.query("SELECT * FROM Orders WHERE id = ?", [
		orderId,
	]);

	if (order.length === 0) {
		res.status(404);
		throw new Error("Order not found");
	}

	if (order[0].orderStatus !== "Shipped") {
		res.status(400);
		throw new Error("Order cannot be marked as delivered until it is shipped");
	}

	await db.query("UPDATE Orders SET orderStatus = 'Delivered' WHERE id = ?", [
		orderId,
	]);

	res.status(200).json({ message: "Order marked as delivered successfully." });
});

// Export all functions
export {
	addOrderItems,
	getMyOrders,
	getOrderById,
	updateOrderToShipped,
	updateOrderToDelivered,
	getOrders,
	cancelOrder,
};
