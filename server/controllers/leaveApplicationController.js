import LeaveApplication from "../models/LeaveApplication.js";
import LeaveAllocation from "../models/LeaveAllocation.js";

// Apply for Leave
export const applyLeave = async (req, res) => {
  try {
    const { employeeId, employeeName, applicationDate, leaveType, leaveInHand, fromDate, toDate, noOfDays, reason } = req.body;

    const allocation = await LeaveAllocation.findOne({ employeeID: employeeId, leaveType });
    if (!allocation) return res.status(400).json({ message: "No leave allocation found for this leave type" });

    if (noOfDays > allocation.leaveInHand) return res.status(400).json({ message: `You only have ${allocation.leaveInHand} days in hand` });

    const newLeave = new LeaveApplication({ employeeId, employeeName, applicationDate, leaveType, leaveInHand, fromDate, toDate, noOfDays, reason });
    await newLeave.save();

    res.status(201).json({ message: "Leave application submitted", newLeave });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get All Leave Applications for an Employee
export const getEmployeeLeaves = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const leaves = await LeaveApplication.find({ employeeId }).sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get Leave Allocations for an Employee
export const getLeaveAllocationsByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    // console.log("EmployeeID:", employeeId); // debug
    const records = await LeaveAllocation.find({ employeeID: employeeId });
    // console.log("Records:", records); // debug

    if (!records.length) return res.status(404).json({ message: "No leave allocations found" });

    res.status(200).json(records);
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
