const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Register
router.post("/register", async (req, res) => {
    try {
      const { username, password, isAdmin } = req.body;
      const user = new User({ username, password, isAdmin });
      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      res.status(500).json({ error: "Registration failed" });
    }
  });

// Login
router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) return res.status(400).json({ error: "User not found" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
  
      const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, "SECRET_KEY", { expiresIn: "1h" });
      res.json({ token, isAdmin: user.isAdmin });
    } catch (err) {
      res.status(500).json({ error: "Login failed" });
    }
  });
  
  module.exports = router;