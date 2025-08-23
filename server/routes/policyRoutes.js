const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  getNextPolicyID,
  createPolicy,
  getAllPolicies,
  updatePolicy,
  deletePolicy,
} = require("../controllers/policyController");

// File storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // all files inside /uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
router.get("/next-id", getNextPolicyID);
router.post("/", upload.single("policyDocument"), createPolicy);
router.get("/", getAllPolicies);
router.put("/:id", upload.single("policyDocument"), updatePolicy);
router.delete("/:id", deletePolicy);

module.exports = router;
