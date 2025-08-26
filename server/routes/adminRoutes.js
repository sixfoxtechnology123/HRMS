const express = require("express");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const path = require("path");
const router = express.Router();

// JWT secret key (use env variable in production)
const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

/* ------------------------- helpers ------------------------- */
const maskAdmin = (adminDoc) => {
  if (!adminDoc) return null;
  const obj = adminDoc.toObject ? adminDoc.toObject() : adminDoc;
  delete obj.password;
  return obj;
};

const auth = (req, res, next) => {
  try {
    const hdr = req.header("Authorization") || "";
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/* ------------------------- uploads ------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

/* --------------------------- LOGIN -------------------------- */
router.post("/login", async (req, res) => {
  const { userId, password } = req.body;
  try {
    const admin = await Admin.findOne({ userId });
    if (!admin) return res.status(400).json({ message: "Invalid User ID" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "1d" });

    // do not return hashed password
    res.json({ success: true, token, admin: maskAdmin(admin) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ---------------------- EDIT PROFILE ------------------------ */
router.put("/edit-profile/:id", upload.single("profileImage"), async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (req.body.name) admin.name = req.body.name;

    if (req.file) {
      // Delete old image if it exists on disk
      if (admin.profileImage && fs.existsSync(admin.profileImage)) {
        try {
          fs.unlinkSync(admin.profileImage);
        } catch (e) {
          console.warn("Failed to delete old image:", e.message);
        }
      }
      admin.profileImage = req.file.path.replace(/\\/g, "/");
    }

    await admin.save();
    res.json({
      success: true,
      message: "Profile updated successfully",
      admin: maskAdmin(admin),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* -------------------- CHANGE PASSWORD (TOKEN) -------------------- */
/* Matches your frontend call: PUT /api/admin/change-password
   Body: { currentPassword, newPassword }, Header: Authorization: Bearer <token> */
router.put("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required" });
    }

    const admin = await Admin.findById(req.userId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    await admin.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ------------- (Optional) Legacy route by :id if needed -------------
   If your frontend NEVER calls this, you can delete it. */
router.put("/change-password/:id", async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();
    res.json({ success: true, message: "Password changed successfully" });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ------------------------- GET PROFILE ------------------------- */
/* Token-based (safe): GET /api/admin/profile  */
router.get("/profile", auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.userId).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

/* ID-based (for your current EditProfile usage): GET /api/admin/profile/:id */
router.get("/profile/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
