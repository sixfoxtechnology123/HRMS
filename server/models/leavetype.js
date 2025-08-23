const mongoose = require("mongoose");

const leaveTypeSchema = new mongoose.Schema({
  leaveTypeID: { type: String, required: true, unique: true },
  leaveName: { type: String, required: true, unique: true },
  leaveCode: { type: String, required: true, unique: true },
  annualQuota: { type: Number, required: true },
  carryForward: { type: String, enum: ["Yes", "No"], default: "No" },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
});

module.exports = mongoose.model("Leave_Type_Master", leaveTypeSchema);
