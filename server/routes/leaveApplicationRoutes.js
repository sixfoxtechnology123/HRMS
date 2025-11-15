const express = require("express");
const router = express.Router();
const {
  applyLeave,
  getEmployeeLeaves,
  getLeaveAllocationsByEmployee,
} = require("../controllers/leaveApplicationController");

router.post("/", applyLeave);
router.get("/employee/:employeeId", getEmployeeLeaves);
router.get("/leaveAllocations/employee/:employeeId", getLeaveAllocationsByEmployee);

module.exports = router;
