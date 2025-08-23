const mongoose = require("mongoose");

const policySchema = new mongoose.Schema({
  policyID: { type: String, required: true, unique: true },
  policyName: { type: String, required: true },
  policyDocument: { type: String }, // stores filename
  effectiveDate: { type: Date, required: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
});

module.exports = mongoose.model("Policy_Master", policySchema);
