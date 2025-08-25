const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    employeeID: { type: String, required: true, unique: true }, // EMP0001
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "Male" },
    dob: { type: String, required: true },
    doj: { type: String, required: true },

    // store master codes like DPT01 / DSG01
    departmentID: { type: String, required: true },
    designationID: { type: String, required: true },

    employmentType: { type: String, enum: ["Full-time", "Part-time", "Contract"], default: "Full-time" },
    workLocation: { type: String, enum: ["Office", "Remote", "Hybrid"], default: "Office" },

    contactNo: { type: String },
    email: { type: String, required: true },

    reportingManagerID: { type: String, default: null }, // employeeID of manager
    status: { type: String, enum: ["Active", "Inactive", "Resigned", "Terminated"], default: "Active" },
  },
  { timestamps: false }
);

module.exports = mongoose.model("Employee_Master", employeeSchema);
