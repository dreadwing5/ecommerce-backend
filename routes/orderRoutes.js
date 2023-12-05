import express from "express";
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToShipped,
  updateOrderToDelivered,
  getOrders,
  cancelOrder,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").post(addOrderItems).get(protect, admin, getOrders);
router.route("/mine").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/ship").put(protect, updateOrderToShipped);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);
router.route("/:id/cancel").put(protect, cancelOrder);

export default router;
