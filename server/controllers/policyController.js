const Policy = require("../models/policy");

// Auto-generate PolicyID
const generatePolicyID = async () => {
  const last = await Policy.findOne().sort({ policyID: -1 });
  let nextNumber = 1;
  if (last && last.policyID) {
    const match = last.policyID.match(/POL(\d+)/);
    if (match) nextNumber = parseInt(match[1], 10) + 1;
  }
  return `POL${String(nextNumber).padStart(4, "0")}`; // POL0001
};

// Get next PolicyID
exports.getNextPolicyID = async (req, res) => {
  try {
    const code = await generatePolicyID();
    res.json({ policyID: code });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate ID" });
  }
};

// Create Policy
exports.createPolicy = async (req, res) => {
  try {
    const { policyID, policyName, effectiveDate, status } = req.body;
    const file = req.file ? req.file.filename : null;

    if (!policyID || !policyName || !effectiveDate) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    const policy = new Policy({
      policyID,
      policyName,
      policyDocument: file,
      effectiveDate,
      status,
    });

    const savedPolicy = await policy.save();
    res.status(201).json(savedPolicy);
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get All Policies
exports.getAllPolicies = async (req, res) => {
  try {
    const policies = await Policy.find();
    res.json(policies);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch policies" });
  }
};

// Update Policy
exports.updatePolicy = async (req, res) => {
  try {
    const { policyName, effectiveDate, status } = req.body;
    const file = req.file ? req.file.filename : undefined;

    const updateData = {
      policyName,
      effectiveDate,
      status,
    };

    if (file) updateData.policyDocument = file;

    const updated = await Policy.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Policy not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Policy
exports.deletePolicy = async (req, res) => {
  try {
    const policy = await Policy.findByIdAndDelete(req.params.id);
    if (!policy) return res.status(404).json({ message: "Policy not found" });
    res.json({ message: "Policy deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
