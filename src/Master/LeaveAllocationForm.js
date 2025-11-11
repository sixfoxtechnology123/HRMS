import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "../component/Sidebar";
import BackButton from "../component/BackButton";
import { useLocation, useNavigate } from "react-router-dom";

const LeaveAllocationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editingData = location.state?.allocation || null;

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    leaveType: "",
    employee: "",
    maxLeave: "",
    openingBalance: "",
    leaveInHand: "",
    monthYear: "",
  });

  // Prefill if editing
  useEffect(() => {
    if (editingData) {
      setFormData({
        leaveType: editingData.leaveType,
        employee: editingData.employee,
        maxLeave: editingData.maxLeave,
        openingBalance: editingData.openingBalance,
        leaveInHand: editingData.leaveInHand,
        monthYear: editingData.monthYear,
      });
    }
  }, [editingData]);

  // Fetch Leave Types and Employees
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/leaveAllocations/leaverules/all")
      .then((res) => setLeaveTypes(res.data))
      .catch(() => toast.error("Failed to load Leave Types"));

    axios
      .get("http://localhost:5001/api/employees")
      .then((res) => setEmployees(res.data))
      .catch(() => toast.error("Failed to load Employee Data"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "leaveType") {
      const selectedLeave = leaveTypes.find((lt) => lt.leaveType === value);
      setFormData({
        ...formData,
        leaveType: value,
        maxLeave: selectedLeave ? selectedLeave.maximumNo : "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleReset = () => {
    setFormData({
      leaveType: "",
      employee: "",
      maxLeave: "",
      openingBalance: "",
      leaveInHand: "",
      monthYear: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.leaveType ||
      !formData.employee ||
      !formData.maxLeave ||
      !formData.openingBalance ||
      !formData.leaveInHand ||
      !formData.monthYear
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    if (editingData) {
      // Edit mode: PUT request
      axios
        .put(`http://localhost:5001/api/leaveAllocations/${editingData._id}`, formData)
        .then(() => {
          toast.success("Leave Allocation Updated!");
          navigate("/LeaveAllocationList");
        })
        .catch(() => toast.error("Failed to update Leave Allocation"));
    } else {
      // New allocation: POST request
      axios
        .post("http://localhost:5001/api/leaveAllocations", formData)
        .then(() => {
          toast.success("Leave Allocation Saved!");
          handleReset();
          navigate("/LeaveAllocationList");
        })
        .catch(() => toast.error("Failed to save Leave Allocation"));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-300 flex">
      <Sidebar />
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="bg-white min-h-screen shadow-lg rounded-lg p-4 w-full">
          <h2 className="text-2xl font-semibold text-gray-700 mb-5 border-b pb-2">
            {editingData ? "Edit Leave Allocation" : "Leave Allocation Form"}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Leave Type */}
            <div>
              <label className="block text-gray-600 mb-1 font-medium">Leave Type</label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                className="w-full pl-2 pr-1 border border-gray-300 font-medium rounded text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all duration-150"
              >
                <option value="">Select Leave Type</option>
                {leaveTypes.map((lt) => (
                  <option key={lt._id} value={lt.leaveType}>
                    {lt.leaveType}
                  </option>
                ))}
              </select>
            </div>

            {/* Employee Name & Code */}
            <div>
              <label className="block text-gray-600 mb-1 font-medium">Employee Name & Code</label>
              <select
                name="employee"
                value={formData.employee}
                onChange={handleChange}
                className="w-full pl-2 pr-1 border border-gray-300 font-medium rounded text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all duration-150"
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option
                    key={emp._id}
                    value={`${emp.firstName} ${emp.middleName} ${emp.lastName} - ${emp.employeeID}`}
                  >
                    {emp.firstName} {emp.middleName} {emp.lastName} - {emp.employeeID}
                  </option>
                ))}
              </select>
            </div>

            {/* Max No. of Leave */}
            <div>
              <label className="block text-gray-600 mb-1 font-medium">Max No. of Leave</label>
              <input
                type="number"
                name="maxLeave"
                value={formData.maxLeave}
                readOnly
                className="w-full pl-2 pr-1 border border-gray-300 bg-gray-100 cursor-not-allowed font-medium rounded text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all duration-150"
                placeholder="Enter maximum no. of leaves"
              />
            </div>

            {/* Opening Balance */}
            <div>
              <label className="block text-gray-600 mb-1 font-medium">Opening Balance</label>
              <input
                type="number"
                name="openingBalance"
                value={formData.openingBalance}
                onChange={handleChange}
                className="w-full pl-2 pr-1 border border-gray-300 font-medium rounded text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all duration-150"
                placeholder="Enter opening balance"
              />
            </div>

            {/* Leave in Hand */}
            <div>
              <label className="block text-gray-600 mb-1 font-medium">Leave in Hand</label>
              <input
                type="number"
                name="leaveInHand"
                value={formData.leaveInHand}
                onChange={handleChange}
                className="w-full pl-2 pr-1 border border-gray-300 font-medium rounded text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all duration-150"
                placeholder="Enter leave in hand"
              />
            </div>

            {/* Month / Year */}
            <div>
              <label className="block text-gray-600 mb-1 font-medium">Month / Year</label>
              <input
                type="month"
                name="monthYear"
                value={formData.monthYear}
                onChange={handleChange}
                className="w-full pl-2 pr-1 border border-gray-300 font-medium rounded text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all duration-150"
              />
            </div>

            {/* Buttons */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-between mt-2">
              <BackButton type="button" />
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-gray-500 font-medium text-white px-4 py-1 rounded"
                >
                  Reset
                </button>
               <button
                  type="submit"
                  className={`font-medium text-white px-4 py-1 rounded ${
                    editingData ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {editingData ? "Update" : "Submit"}
                </button>

              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaveAllocationForm;
