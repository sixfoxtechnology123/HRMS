import mongoose from "mongoose";

const leaveAllocationSchema = new mongoose.Schema(
  {
    leaveType: {
      type: String,
      required: true,
    },
    employee: {
      type: String,
      required: true,
    },
    maxLeave: {
      type: Number,
      required: true,
    },
    openingBalance: {
      type: Number,
      required: true,
    },
    leaveInHand: {
      type: Number,
      required: true,
    },
    monthYear: {
      type: String, // format: "2025-01"
      required: true,
    },
  },
  { timestamps: true }
);

const LeaveAllocation = mongoose.model("LeaveAllocation", leaveAllocationSchema);
export default LeaveAllocation;
