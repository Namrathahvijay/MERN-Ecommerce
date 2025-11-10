import orderModel from "../models/orderModel.js";

// INFO: List all orders (admin only)
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log("Error while listing orders: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// INFO: List orders for current user (user only)
const listMyOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await orderModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log("Error while listing user orders: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// INFO: Create an order (user only)
const createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, amount, address, paymentId } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Items are required" });
    }
    if (typeof amount !== "number" || amount < 0) {
      return res.status(400).json({ success: false, message: "Amount must be a non-negative number" });
    }
    if (!address || typeof address !== "object") {
      return res.status(400).json({ success: false, message: "Address is required" });
    }

    // Basic validation for each item
    for (const it of items) {
      if (!it.productId || !it.quantity || it.quantity < 1) {
        return res.status(400).json({ success: false, message: "Invalid item in items" });
      }
    }

    const order = await orderModel.create({
      userId,
      items,
      amount,
      address,
      paymentId: paymentId || undefined,
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.log("Error while creating order: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// INFO: Update an order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }

    const allowed = [
      "pending",
      "processing",
      "shipped",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${allowed.join(", ")}`,
      });
    }

    const order = await orderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.log("Error while updating order status: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// INFO: Cancel an order (user only)
const cancelOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const order = await orderModel.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    if (String(order.userId) !== String(userId)) {
      return res.status(403).json({ success: false, message: "Not allowed to cancel this order" });
    }

    const cancellable = ["pending", "processing"];
    if (!cancellable.includes(order.status)) {
      return res.status(400).json({ success: false, message: "Order cannot be cancelled at this stage" });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.log("Error while cancelling order: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { listOrders, listMyOrders, createOrder, updateOrderStatus, cancelOrder };
