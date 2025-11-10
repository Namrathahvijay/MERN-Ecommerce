import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import userAuth from "../middleware/userAuth.js";
import { listOrders, listMyOrders, createOrder, updateOrderStatus, cancelOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

// Admin: list all orders
orderRouter.get("/", adminAuth, listOrders);

// Admin: update order status
orderRouter.patch("/:id/status", adminAuth, updateOrderStatus);

// User: list my orders
orderRouter.get("/my", userAuth, listMyOrders);

// User: create an order
orderRouter.post("/", userAuth, createOrder);

// User: cancel an order
orderRouter.patch("/:id/cancel", userAuth, cancelOrder);

export default orderRouter;
