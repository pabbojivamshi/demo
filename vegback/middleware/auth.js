// backend/middleware/auth.js
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: "Access denied. Admin only." });
  next();
};

module.exports = { auth, isAdmin };