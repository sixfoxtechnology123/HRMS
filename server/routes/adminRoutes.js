const express = require("express");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// JWT secret key (use env variable in production)
const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// Multer setup for profile image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({ storage });

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
  const { userId, password } = req.body;
  try {
    const admin = await Admin.findOne({ userId });
    if (!admin) return res.status(400).json({ message: "Invalid User ID" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

    // Generate JWT token
    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "1d" });

    res.json({ success: true, token, admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ---------------- EDIT PROFILE ----------------
router.put("/edit-profile/:id", upload.single("profileImage"), async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (req.body.name) admin.name = req.body.name;

    if (req.file) {
      // Delete old image if exists
      if (admin.profileImage && fs.existsSync(admin.profileImage)) fs.unlinkSync(admin.profileImage);
      admin.profileImage = req.file.path;
    }

    await admin.save();
    res.json({ success: true, message: "Profile updated successfully", admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ---------------- CHANGE PASSWORD ----------------
router.put("/change-password/:id", async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Old password incorrect" });

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ---------------- GET PROFILE ----------------
router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json(admin);
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

module.exports = router;
