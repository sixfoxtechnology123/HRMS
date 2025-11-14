const LeaveApplication = require("../models/LeaveApplication");
const LeaveAllocation = require("../models/LeaveAllocation");

// Apply for Leave
exports.applyLeave = async (req, res) => {
  try {
    const {
      employeeId,
      employeeName,
      applicationDate,
      leaveType,
      leaveInHand,
      fromDate,
      toDate,
      noOfDays,
      reason,
    } = req.body;

    // Check leave allocation
    const allocation = await LeaveAllocation.findOne({
      employee: new RegExp(employeeId, "i"),
      leaveType,
    });

    if (!allocation) {
      return res
        .status(400)
        .json({ message: "No leave allocation found for this leave type" });
    }

    // Leave In Hand check
    if (noOfDays > allocation.leaveInHand) {
      return res.status(400).json({
        message: `You only have ${allocation.leaveInHand} days in hand`,
      });
    }

    // Save leave application
    const newLeave = new LeaveApplication({
      employeeId,
      employeeName,
      applicationDate,
      leaveType,
      leaveInHand,
      fromDate,
      toDate,
      noOfDays,
      reason,
    });

    await newLeave.save();

    res.status(201).json({ message: "Leave application submitted", newLeave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Leave Applications for an Employee
exports.getEmployeeLeaves = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;

    const leaves = await LeaveApplication.find({ employeeId }).sort({
      createdAt: -1,
    });

    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get leave allocations for an employee
exports.getLeaveAllocationsByEmployee = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;

    // Find all leave allocations for this employee
    const allocations = await LeaveAllocation.find({
      employee: new RegExp(employeeId, "i"), // match employee id in 'employee' field
    });

    if (!allocations || allocations.length === 0) {
      return res.status(404).json({ message: "No leave allocations found" });
    }

    res.status(200).json(allocations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};