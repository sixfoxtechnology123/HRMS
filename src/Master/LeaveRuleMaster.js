import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "../component/Sidebar";
import BackButton from "../component/BackButton";

const LeaveRuleMaster = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [formData, setFormData] = useState({
    leaveType: "",
    maximumNo: "",
    entitledFromMonth: "",
    maximumBalance: "",
    effectiveFrom: "",
    effectiveTo: "",
  });

  // Fetch leave types from LeaveTypeMaster
  useEffect(() => {
    axios
      .get("/api/leavetypemaster") // replace with your backend endpoint
      .then((res) => {
        setLeaveTypes(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch leave types");
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation
    if (
      !formData.leaveType ||
      !formData.maximumNo ||
      !formData.entitledFromMonth ||
      !formData.maximumBalance ||
      !formData.effectiveFrom ||
      !formData.effectiveTo
    ) {
      toast.error("Please fill all mandatory fields");
      return;
    }

    axios
      .post("/api/leaverule", formData) // replace with your backend endpoint
      .then((res) => {
        toast.success("Leave rule saved successfully");
        setFormData({
          leaveType: "",
          maximumNo: "",
          entitledFromMonth: "",
          maximumBalance: "",
          effectiveFrom: "",
          effectiveTo: "",
        });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to save leave rule");
      });
  };

  const handleReset = () => {
    setFormData({
      leaveType: "",
      maximumNo: "",
      entitledFromMonth: "",
      maximumBalance: "",
      effectiveFrom: "",
      effectiveTo: "",
    });
  };

  return (
     <div className="min-h-screen bg-zinc-300 flex">
        <Sidebar />

        <div className="flex-1 p-3 overflow-y-auto">
          <div className="bg-white min-h-screen shadow-lg rounded-lg p-4 w-full">
      <h2 className="text-xl font-bold mb-4">Leave Rule Form</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Leave Type */}
        <div>
          <label className="block font-medium mb-1">
            Leave Type <span className="text-red-600">*</span>
          </label>
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            className="w-full pl-2 pr-1 border border-gray-300 font-medium rounded text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all duration-150"
          >
            <option value="">Select</option>
            {leaveTypes.map((type) => (
              <option key={type._id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Maximum No */}
        <div>
          <label className="block font-medium mb-1">
            Maximum No. <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            name="maximumNo"
            value={formData.maximumNo}
            onChange={handleChange}
            className="w-full pl-2 pr-1 border border-gray-300 font-medium rounded text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all duration-150"
          />
        </div>

        {/* Entitled From Month */}
        <div>
          <label className="block font-medium mb-1">
            Entitled From Month <span className="text-red-600">*</span>
          </label>
          <select
            name="entitledFromMonth"
            value={formData.entitledFromMonth}
            onChange={handleChange}
            className="w-full pl-2 pr-1 border border-gray-300 font-medium rounded text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all duration-150"
          >
            <option value="">Select</option>
            {[
              "January","February","March","April","May","June",
              "July","August","September","October","November","December"
            ].map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        {/* Maximum Balance Enjoy */}
        <div>
          <label className="block font-medium mb-1">
            Maximum Balance Enjoy <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            name="maximumBalance"
            value={formData.maximumBalance}
            onChange={handleChange}
            className="w-full pl-2 pr-1 border border-gray-300 font-medium rounded text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all duration-150"
          />
        </div>

        {/* Effective From */}
        <div>
          <label className="block font-medium mb-1">
            Effective From <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            name="effectiveFrom"
            value={formData.effectiveFrom}
            onChange={handleChange}
            className="w-full pl-2 pr-1 border border-gray-300 font-medium rounded text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all duration-150"
          />
        </div>

        {/* Effective To */}
        <div>
          <label className="block font-medium mb-1">
            Effective To <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            name="effectiveTo"
            value={formData.effectiveTo}
            onChange={handleChange}
            className="w-full pl-2 pr-1 border border-gray-300 font-medium rounded text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition-all duration-150"
          />
        </div>

        {/* Buttons */}
         <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-between mt-2">
              <BackButton type="button" />
        <div className="col-span-full flex justify-end gap-2 mt-2">
              <button
            type="button"
            onClick={handleReset}
            className="bg-gray-500 forn-medium text-white px-4 py-1 rounded"
          >
            Reset
          </button>
          <button
            type="submit"
            className="bg-blue-500 forn-medium text-white px-4 py-1 rounded"
          >
            Submit
          </button>
        
        </div>
        </div>
      </form>

      {/* <p className="text-red-600 mt-2 text-right">(*) marked fields are mandatory</p> */}
    </div>
    </div>
    </div>
    
  );
};

export default LeaveRuleMaster;
