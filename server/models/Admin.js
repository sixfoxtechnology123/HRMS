const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed in production
});

module.exports = mongoose.model("Admin", adminSchema);
