import asyncHandler from "../middleware/asyncHandler.js";
import db from "../config/db.js";
import { calcPrices } from "../utils/calcPrices.js";
// import { verifyPayPalPayment, checkIfNewTransaction } from "../utils/paypal.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, userId } = req.body;

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

    const [orderResult] = await db.query(
      "INSERT INTO Orders (userId, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        userId,
        shippingAddressString,
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
  const userId = req.user.id; // The user ID should be retrieved from the auth middleware
  const [orders] = await db.query("SELECT * FROM Orders WHERE userId = ?", [
    userId,
  ]);
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  // const userId = req.user.id; // Ensure that the user requesting the order is the owner

  // First, fetch the order to check if it belongs to the user
  const [order] = await db.query("SELECT * FROM orders WHERE id = ?", [
    orderId,
  ]);

  if (order.length === 0) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Then, perform a JOIN operation to get all items associated with the order
  const [orderItems] = await db.query(
    "SELECT * FROM orderitems WHERE orderId = ?",
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

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  throw new Error("updateOrderToPaid function not implemented");
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  throw new Error("updateOrderToDelivered function not implemented");
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  throw new Error("getOrders function not implemented");
});

// Export all functions
export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  // ... other exported functions
};
