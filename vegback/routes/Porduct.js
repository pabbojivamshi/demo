// backend/routes/product.js
const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const { auth, isAdmin } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Save files in the 'uploads' folder
    console.log(path.join(__dirname,__filename,"../uploads"),"example steing path")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage });

// Add a new product (Admin only)
router.post("/", auth, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, price } = req.body;
    const image = req.file ? req.file.filename : ""; // Save only the filename

    const product = new Product({ name, price, image });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Get all products (Public route)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    // Add the full image URL to each product
    const productsWithImageUrl = products.map((product) => ({
      ...product._doc,
      image: `http://localhost:5000/uploads/${product.image}`,
    }));
    res.json(productsWithImageUrl);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

module.exports = router;