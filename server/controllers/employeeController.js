const Employee = require("../models/Employee");
const Activity = require("../models/Activity");

// Auto-generate EmployeeID: EMP1, EMP2, EMP3...
const generateEmployeeID = async () => {
  try {
    // Get the last created employee, sorted by createdAt descending
    const lastEmp = await Employee.findOne().sort({ createdAt: -1 }).lean();
    let next = 1;

    if (lastEmp?.employeeID) {
      const match = lastEmp.employeeID.match(/EMP(\d+)/);
      if (match) next = parseInt(match[1], 10) + 1;
    }

    return `EMP${next}`;
  } catch (err) {
    console.error("Error generating employeeID:", err);
    return "EMP1";
  }
};

// GET /api/employees/next-id
exports.getNextEmployeeID = async (req, res) => {
  try {
    const employeeID = await generateEmployeeID();
    res.json({ employeeID });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate employee ID" });
  }
};

// POST /api/employees
exports.createEmployee = async (req, res) => {
  try {
    if (!req.body) req.body = {};

    // Auto-generate employeeID if not provided
    if (!req.body.employeeID) {
      req.body.employeeID = await generateEmployeeID();
    }

    // // Required fields
    // const required = ["firstName", "lastName", "dob",];
    // for (const field of required) {
    //   if (!req.body[field]) {
    //     return res.status(400).json({ message: `Field ${field} is required` });
    //   }
    // }

    const emp = new Employee({ ...req.body });
    const saved = await emp.save();

    // Log activity
    try {
      await Activity.create({
        text: `Employee Added: ${saved.firstName} ${saved.lastName} (${saved.employeeID})`,
      });
    } catch (logErr) {
      console.error("Activity log error (createEmployee):", logErr);
    }

    res.status(201).json(saved);
  } catch (err) {
    console.error("Create employee error:", err);
    res.status(500).json({ error: err.message || "Failed to save employee" });
  }
};

// GET /api/employees
exports.getAllEmployees = async (req, res) => {
  try {
    const rows = await Employee.find().sort({ createdAt: 1 });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
};

// GET /api/employees/managers
exports.getManagers = async (req, res) => {
  try {
    const rows = await Employee.find({}, "employeeID firstName lastName").sort({ createdAt: 1 });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch managers" });
  }
};

// PUT /api/employees/:id
exports.updateEmployee = async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Employee not found" });

    try {
      await Activity.create({
        text: `Employee Updated: ${updated.firstName} ${updated.lastName} (${updated.employeeID})`,
      });
    } catch (logErr) {
      console.error("Activity log error (updateEmployee):", logErr);
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/employees/:id
exports.deleteEmployee = async (req, res) => {
  try {
    const del = await Employee.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ message: "Employee not found" });

    try {
      await Activity.create({
        text: `Employee Deleted: ${del.firstName} ${del.lastName} (${del.employeeID})`,
      });
    } catch (logErr) {
      console.error("Activity log error (deleteEmployee):", logErr);
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
