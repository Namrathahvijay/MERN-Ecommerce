import express from "express";
import {
  addProduct,
  listProducts,
  removeProduct,
  getSingleProduct,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

// Conditionally run multer only for multipart requests
const maybeUpload = (req, res, next) => {
  const isMultipart = req.is && req.is("multipart/form-data");
  if (isMultipart) {
    return upload.fields([
      { name: "image1", maxCount: 1 },
      { name: "image2", maxCount: 1 },
      { name: "image3", maxCount: 1 },
      { name: "image4", maxCount: 1 },
    ])(req, res, next);
  }
  next();
};

productRouter.post(
  "/add",
  adminAuth,
  maybeUpload,
  addProduct
);
productRouter.post("/remove", adminAuth, removeProduct);
productRouter.post("/single", getSingleProduct);
productRouter.get("/list", listProducts);

export default productRouter;
