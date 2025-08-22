const Designation = require('../models/Designation');

// Auto-generate DesignationID
const generateDesignationID = async () => {
  const last = await Designation.findOne().sort({ designationID: -1 });
  let nextNumber = 1;
  if (last && last.designationID) {
    const match = last.designationID.match(/DESG(\d+)/);
    if (match) nextNumber = parseInt(match[1], 10) + 1;
  }
  return `DESG${String(nextNumber).padStart(2, '0')}`;
};

// Get next DesignationID
exports.getNextDesignationID = async (req, res) => {
  try {
    const code = await generateDesignationID();
    res.json({ designationID: code });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate ID' });
  }
};

exports.createDesignation = async (req, res) => {
  try {
    const { designationID, designationName, departmentName, grade, status } = req.body;

    if (!designationID || !designationName || !departmentName || !grade) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const designation = new Designation({ designationID, designationName, departmentName, grade, status });
    const savedDesignation = await designation.save();

    res.status(201).json(savedDesignation);
  } catch (err) {
    console.error("Save error:", err); // detailed error
    res.status(500).json({ error: err.message });
  }
};


// Get all designations
exports.getAllDesignations = async (req, res) => {
  try {
    const designations = await Designation.find(); 
    res.json(designations);
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).json({ error: 'Failed to fetch designations' });
  }
};


// Update designation
exports.updateDesignation = async (req, res) => {
  try {
    const updated = await Designation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Designation not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete designation
exports.deleteDesignation = async (req, res) => {
  try {
    const designation = await Designation.findByIdAndDelete(req.params.id);
    if (!designation) return res.status(404).json({ message: 'Designation not found' });
    res.json({ message: 'Designation deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
