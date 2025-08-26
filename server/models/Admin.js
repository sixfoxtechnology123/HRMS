const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: "Admin" },
  profileImage: { type: String, default: "" }, // URL of profile image
});

module.exports = mongoose.model("Admin", adminSchema);
