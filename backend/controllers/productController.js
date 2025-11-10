import path from "path";
import productModel from "../models/productModel.js";

// INFO: Route for adding a product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestSeller,
      imageUrls: rawImageUrls,
    } = req.body;

    if (!name || !description || !price || !category || !subCategory || sizes === undefined) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let parsedSizes = [];
    try {
      parsedSizes = Array.isArray(sizes) ? sizes : JSON.parse(sizes || "[]");
      if (!Array.isArray(parsedSizes)) parsedSizes = [];
    } catch (_) {
      return res.status(400).json({ success: false, message: "Invalid sizes format" });
    }

    const files = req.files || {};
    const image1 = files.image1 && files.image1[0];
    const image2 = files.image2 && files.image2[0];
    const image3 = files.image3 && files.image3[0];
    const image4 = files.image4 && files.image4[0];

    const productImages = [image1, image2, image3, image4].filter((image) => !!image);

    // Accept image URLs via body as alternative to upload
    let bodyImageUrls = [];
    if (rawImageUrls) {
      try {
        if (Array.isArray(rawImageUrls)) {
          bodyImageUrls = rawImageUrls;
        } else if (typeof rawImageUrls === "string") {
          // Accept JSON string or comma-separated list
          if (rawImageUrls.trim().startsWith("[")) {
            bodyImageUrls = JSON.parse(rawImageUrls);
          } else {
            bodyImageUrls = rawImageUrls.split(",").map((s) => s.trim()).filter(Boolean);
          }
        }
      } catch (_) {
        return res.status(400).json({ success: false, message: "Invalid imageUrls format" });
      }
    }

    const host = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
    const uploadUrls = productImages.map((file) => {
      const filename = path.basename(file.path);
      return `${host}/uploads/${filename}`;
    });
    const safeBodyUrls = (bodyImageUrls || []).filter((u) => typeof u === "string" && /^https?:\/\//i.test(u));
    const imageUrls = [...uploadUrls, ...safeBodyUrls];

    if (imageUrls.length === 0) {
      return res.status(400).json({ success: false, message: "Please provide at least one image URL or upload an image" });
    }

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: parsedSizes,
      bestSeller: bestSeller === "true" || bestSeller === true,
      image: imageUrls,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.status(201).json({ success: true, message: "Product added" });
  } catch (error) {
    console.log("Error while adding product: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// INFO: Route for fetching all products
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.log("Error while fetching all products: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// INFO: Route for removing a product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.status(200).json({ success: true, message: "Product removed" });
  } catch (error) {
    console.log("Error while removing product: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// INFO: Route for fetching a single product
const getSingleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.log("Error while fetching single product: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addProduct, listProducts, removeProduct, getSingleProduct };
