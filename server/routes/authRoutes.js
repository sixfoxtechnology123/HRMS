const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Login route
router.post("/login", async (req, res) => {
  const { userId, password } = req.body;
  const user = await User.findOne({ userId });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign(
    { id: user._id, role: user.role, permissions: user.permissions },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({ token, role: user.role, permissions: user.permissions });
});

module.exports = router;
