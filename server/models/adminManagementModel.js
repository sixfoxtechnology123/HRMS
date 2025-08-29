const mongoose = require("mongoose");

const adminManagementSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Admin", "HR", "Manager", "Employee"], default: "HR" },
    permissions: [{ type: String }],
  },
  { timestamps:false }
);

module.exports =
  mongoose.models.AdminManagement ||
  mongoose.model("AdminManagement", adminManagementSchema);
