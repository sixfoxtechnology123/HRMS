const express = require("express");
const router = express.Router();
const {
  applyLeave,
  getEmployeeLeaves,
  getLeaveAllocationsByEmployee
} = require("../controllers/leaveApplicationController");

// Apply for leave
router.post("/", applyLeave);

// Fetch all leaves for an employee
router.get("/:employeeId", getEmployeeLeaves);
router.get("/:employeeId", getLeaveAllocationsByEmployee);

module.exports = router;
