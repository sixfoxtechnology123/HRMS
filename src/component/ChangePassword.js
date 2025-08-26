import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5001/api/admin/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Change Password</h2>

        {message && <p className="text-red-500 mb-3">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Change Password
          </button>
        </form>

        <button
          onClick={() => navigate("/Dashboard")}
          className="mt-3 w-full py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
