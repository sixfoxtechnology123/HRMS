import React, { useState, useEffect } from "react";
import axios from "axios";
import BackButton from "../component/BackButton";
import { useNavigate, useLocation } from "react-router-dom";

const ShiftMaster = () => {
  const [shift, setShift] = useState({
    _id: "",
    shiftID: "",
    shiftName: "",
    startTime: "",
    endTime: "",
    breakDuration: "",
    status: "Active",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Load mode (Add vs Edit)
  useEffect(() => {
    const fetchNextShiftId = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/shifts/next-id");
        const nextId = res.data?.shiftID || "SHIFT0001";
        setShift((prev) => ({ ...prev, shiftID: nextId }));
      } catch (err) {
        console.error("Error getting next shiftID:", err);
      }
    };

    if (location.state?.shift) {
      // EDIT MODE → keep same ID, don't regenerate
      const s = location.state.shift;
      setIsEditMode(true);
      setShift({
        _id: s._id,
        shiftID: s.shiftID,   // fixed → always existing id
        shiftName: s.shiftName || "",
        startTime: s.startTime || "",
        endTime: s.endTime || "",
        breakDuration: s.breakDuration || "",
        status: s.status || "Active",
      });
    } else {
      // ADD MODE → generate new ID
      setIsEditMode(false);
      fetchNextShiftId();
    }
  }, [location.state]);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setShift((prev) => ({ ...prev, [name]: value }));
  };

  // Save / Update
  const handleSaveOrUpdate = async (e) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        //  UPDATE → never send shiftID (kept constant)
        const { _id, shiftID, ...payload } = shift;
        await axios.put(`http://localhost:5001/api/shifts/${_id}`, payload);
        alert("Shift updated successfully!");
      } else {
        // CREATE → include shiftID
        await axios.post("http://localhost:5001/api/shifts", shift);
        alert("Shift added successfully!");
      }
      navigate("/shiftList", { replace: true });
    } catch (err) {
      console.error("Save failed:", err);
      alert(err?.response?.data?.error || "Error saving shift");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">
          {isEditMode ? "Update Shift" : "Shift Master"}
        </h2>

        <form onSubmit={handleSaveOrUpdate}>
          <div className="mb-4">
            <label className="block text-black mb-1">Shift ID</label>
            <input
              type="text"
              name="shiftID"
              value={shift.shiftID}
              readOnly
              className="w-full p-1 border rounded bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="mb-4">
            <label className="block text-black mb-1">Shift Name</label>
            <input
              type="text"
              name="shiftName"
              value={shift.shiftName}
              onChange={handleChange}
              className="w-full p-1 border rounded" placeholder="eg-Morning, Night, General"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-black mb-1">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={shift.startTime}
              onChange={handleChange}
              className="w-full p-1 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-black mb-1">End Time</label>
            <input
              type="time"
              name="endTime"
              value={shift.endTime}
              onChange={handleChange}
              className="w-full p-1 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-black mb-1">Break Duration (minutes)</label>
            <input
              type="number"
              name="breakDuration"
              value={shift.breakDuration}
              onChange={handleChange}
              className="w-full p-1 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-black mb-1">Status</label>
            <select
              name="status"
              value={shift.status}
              onChange={handleChange}
              className="w-full p-1 border rounded"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-between">
            <BackButton />
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

export default ShiftMaster;
