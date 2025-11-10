import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    items: { type: [itemSchema], required: true },
    amount: { type: Number, required: true, min: 0 },
    address: { type: Object, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },
    paymentId: { type: String },
  },
  { timestamps: true }
);

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
