const Department = require('../models/Department');

const generateDeptCode = async () => {
  const lastDept = await Department.findOne().sort({ deptCode: -1 });
  let nextNumber = 1;

  if (lastDept && lastDept.deptCode) {
    const match = lastDept.deptCode.match(/DEPT(\d+)/);
    if (match) nextNumber = parseInt(match[1], 10) + 1;
  }

  return `DEPT${String(nextNumber).padStart(4, '0')}`;
};

// Generate next department code
exports.getNextDeptCode = async (req, res) => {
  try {
    const code = await generateDeptCode();
    res.json({ deptCode: code });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate code' });
  }
};

// Create
exports.createDepartment = async (req, res) => {
  try {
    const { deptCode, deptName, description, status } = req.body;
    const department = new Department({ deptCode, deptName, description, status });
    await department.save();
    res.status(201).json(department);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

// Update
exports.updateDepartment = async (req, res) => {
  try {
    const { deptCode, deptName, description, status } = req.body;
    const updated = await Department.findByIdAndUpdate(
      req.params.id,
      { deptCode, deptName, description, status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Department not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
