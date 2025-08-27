const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") return res.status(403).json({ message: "Admin only" });
  next();
};

// Create new user
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { userId, name, password, role, permissions } = req.body;
    const user = new User({ userId, name, password, role, permissions });
    await user.save();
    res.json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update permissions
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { permissions } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { permissions }, { new: true });
    res.json({ message: "Permissions updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

module.exports = router;
