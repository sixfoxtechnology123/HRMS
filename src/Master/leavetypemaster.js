import React, { useState, useEffect } from "react";
import axios from "axios";
import BackButton from "../component/BackButton";
import { useNavigate, useLocation } from "react-router-dom";

const LeaveTypeMaster = () => {
  const [leaveTypeID, setLeaveTypeID] = useState("");
  const [leaveName, setLeaveName] = useState("");
  const [leaveCode, setLeaveCode] = useState("");
  const [annualQuota, setAnnualQuota] = useState("");
  const [carryForward, setCarryForward] = useState("No");
  const [status, setStatus] = useState("Active");
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchLeaveTypes();

    if (location.state?.leaveType) {
      // -------- EDIT MODE --------
      const lt = location.state.leaveType;
      setLeaveTypeID(lt.leaveTypeID); // keep existing id
      setLeaveName(lt.leaveName);
      setLeaveCode(lt.leaveCode);
      setAnnualQuota(lt.annualQuota);
      setCarryForward(lt.carryForward);
      setStatus(lt.status);
      setEditId(lt._id);
      setIsEditMode(true);
    } else {
      // -------- ADD MODE --------
      fetchNextLeaveTypeID();
      setIsEditMode(false);
    }
  }, [location.state]);

  const fetchLeaveTypes = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/leavetypes");
      setLeaveTypes(res.data);
    } catch (err) {
      console.error("Fetch LeaveTypes Error:", err);
    }
  };

  const fetchNextLeaveTypeID = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/leavetypes/next-id");
      setLeaveTypeID(res.data.leaveTypeID);
    } catch (err) {
      console.error("Fetch Next ID Error:", err);
    }
  };

  const handleSaveOrUpdate = async (e) => {
    e.preventDefault();

    if (!leaveName.trim() || !leaveCode.trim() || !annualQuota) {
      alert("All fields are required");
      return;
    }

    const duplicate = leaveTypes.find(
      (lt) =>
        lt.leaveName.toLowerCase().trim() === leaveName.toLowerCase().trim() &&
        lt._id !== editId
    );
    if (duplicate) {
      alert("Leave type already exists!");
      return;
    }

    try {
      if (isEditMode) {
        // update → don't change leaveTypeID
        await axios.put(`http://localhost:5001/api/leavetypes/${editId}`, {
          leaveTypeID,
          leaveName,
          leaveCode,
          annualQuota,
          carryForward,
          status,
        });
        alert("Leave type updated successfully");
      } else {
        // create → include new leaveTypeID
        await axios.post("http://localhost:5001/api/leavetypes", {
          leaveTypeID,
          leaveName,
          leaveCode,
          annualQuota,
          carryForward,
          status,
        });
        alert("Leave type saved successfully");
      }

      navigate("/leavetypeList", { replace: true });
    } catch (err) {
      console.error("Save/Update Error:", err);
      alert("Failed to save/update");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">
          {isEditMode ? "Update Leave Type" : "Leave Type Master"}
        </h2>
        <form
          onSubmit={handleSaveOrUpdate}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div>
            <label className="block font-medium">Leave Type ID</label>
            <input
              type="text"
              value={leaveTypeID}
              readOnly
              className="w-full border border-gray-300 p-1 rounded bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-medium">Leave Name</label>
            <input
              type="text"
              value={leaveName}
              onChange={(e) => setLeaveName(e.target.value)}
              className="w-full p-1 border rounded"
              placeholder="Casual, Sick, Maternity, etc"
            />
          </div>

          <div>
            <label className="block font-medium">Leave Code</label>
            <input
              type="text"
              value={leaveCode}
              onChange={(e) => setLeaveCode(e.target.value)}
              className="w-full p-1 border rounded"
              placeholder="e.g., CL, SL"
            />
          </div>

          <div>
            <label className="block font-medium">Annual Quota</label>
            <input
              type="number"
              value={annualQuota}
              onChange={(e) => setAnnualQuota(e.target.value)}
              className="w-full p-1 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Carry Forward</label>
            <select
              value={carryForward}
              onChange={(e) => setCarryForward(e.target.value)}
              className="w-full p-1 border rounded"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-1 border rounded"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-between mt-2">
            <BackButton type="button" />
            <button
              type="submit"
              className={`px-4 py-1 rounded text-white ${
                isEditMode
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-teal-600 hover:bg-teal-700"
              }`}
            >
              {isEditMode ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveTypeMaster;