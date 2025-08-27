const Employee = require("../models/Employee");
const Activity = require("../models/Activity"); 

// ---- Auto-generate EmployeeID: EMP0001, EMP0002, ...
const generateEmployeeID = async () => {
  const last = await Employee.findOne().sort({ employeeID: -1 });
  let next = 1;
  if (last?.employeeID) {
    const m = last.employeeID.match(/EMP(\d+)/);
    if (m) next = parseInt(m[1], 10) + 1;
  }
  return `EMP${String(next).padStart(4, "0")}`;
};

// GET /api/employees/next-id
exports.getNextEmployeeID = async (req, res) => {
  try {
    const employeeID = await generateEmployeeID();
    res.json({ employeeID });
  } catch (e) {
    res.status(500).json({ error: "Failed to generate ID" });
  }
};

// POST /api/employees
exports.createEmployee = async (req, res) => {
  try {
    const required = ["employeeID", "firstName", "lastName", "dob", "doj", "departmentID", "designationID"];
    for (const f of required) {
      if (!req.body[f]) return res.status(400).json({ message: `Field ${f} is required` });
    }

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
  } catch (e) {
    console.error("Create employee error:", e);
    res.status(500).json({ error: e.message });
  }
};


// GET /api/employees
exports.getAllEmployees = async (req, res) => {
  try {
    const rows = await Employee.find().sort({ createdAt: 1 });
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
};



// GET /api/employees/managers  (minimal list for dropdown)
exports.getManagers = async (req, res) => {
  try {
    const rows = await Employee.find({}, "employeeID firstName lastName").sort({ employeeID: 1 });
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch managers" });
  }
};

// PUT /api/employees/:id
exports.updateEmployee = async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Employee not found" });
     //  Log activity
    try {
      await Activity.create({
        text: `Employee Updated: ${updated.firstName} ${updated.lastName} (${updated.employeeID})`,
      });
    } catch (logErr) {
      console.error("Activity log error (updateEmployee):", logErr);
    }

    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// DELETE /api/employees/:id
exports.deleteEmployee = async (req, res) => {
  try {
    const del = await Employee.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ message: "Employee not found" });
     //  Log activity
    try {
      await Activity.create({
        text: `Employee Deleted: ${del.firstName} ${del.lastName} (${del.employeeID})`,
      });
    } catch (logErr) {
      console.error("Activity log error (deleteEmployee):", logErr);
    }
    
    res.json({ message: "Employee deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
