// backend/routes/adminRoutes.js
const express = require("express");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs"); // for hashing passwords
const jwt = require("jsonwebtoken");

const router = express.Router();

// Admin Login
router.post("/login", async (req, res) => {
  const { userId, password } = req.body;

  try {
    const admin = await Admin.findOne({ userId });
    if (!admin) return res.status(400).json({ message: "Invalid User ID" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

    const token = jwt.sign({ id: admin._id }, "secretKey", { expiresIn: "1h" });
    res.json({ token, userId: admin.userId });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
