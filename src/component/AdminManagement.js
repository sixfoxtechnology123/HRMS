import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react"; // home icon
import { Eye, EyeOff } from "lucide-react"; // eye icons for password
import Sidebar from '../component/Sidebar';


export default function AdminManagement() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [newUser, setNewUser] = useState({
    userId: "",
    name: "",
    password: "",
    role: "HR",
    permissions: [],
  });

  // Updated permission list
  const permissionsList = [
    "Dashboard_View",
    "Department_View",
    "Designation_View",
    "Leave_Manage",
    "Holiday_Manage",
    "Shift_Manage",
    "Policy_Manage",
    "Location_Manage",
    "Payroll_Manage",
    "Employee_View",
    "Admin_Management"
  ];

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5001/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createUser = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5001/api/users", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewUser({
        userId: "",
        name: "",
        password: "",
        role: "HR",
        permissions: [],
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const togglePermission = (perm) => {
    setNewUser((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar/>
    <div className="flex-1 overflow-y-auto">
    <div className="min-h-screen bg-green-50 p-4">
      {/* Top Header with Home */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-green-800">Admin Management</h2>
         <button
            onClick={() => navigate("/Dashboard")}
            className="flex items-center gap-2 bg-green-600 text-white px-4 font-semibold py-1 rounded-lg shadow hover:bg-green-700">
            <Home size={20} /> Home
            </button>
      </div>

      {/* Create User Form */}
      <div className="bg-white p-4 rounded-2xl shadow mb-3 border border-green-200">
        <h3 className="text-lg font-semibold text-green-700 mb-4">
          Create New User
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* User ID */}
          <div>
            <label className="block text-sm font-medium text-green-800">
              User ID
            </label>
            <input
              placeholder="Enter User ID"
              value={newUser.userId}
              onChange={(e) =>
                setNewUser({ ...newUser, userId: e.target.value })
              }
              className="border border-green-300 p-1 rounded w-full"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-green-800">
              Name
            </label>
            <input
              placeholder="Enter Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="border border-green-300 p-1 rounded w-full"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-green-800">
              Password
            </label>
            <input
              placeholder="Enter Password"
              type={showPassword ? "text" : "password"}
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              className="border border-green-300 p-1 rounded w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-7 text-green-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-green-800">
              Role
            </label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="border border-green-300 p-1 rounded w-full"
            >
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Employee">Employee</option>
            </select>
          </div>
        </div>

      {/* Permissions */}
            <div className="mt-4">
            <h4 className="font-medium text-green-700 mb-2">Permissions:</h4>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 font-semibold">
                {permissionsList.map((perm) => (
                <label key={perm} className="flex items-center">
                    <input
                    type="checkbox"
                    checked={newUser.permissions.includes(perm)}
                    onChange={() => togglePermission(perm)}
                    className="mr-2 "
                    />
                    {perm.replace("_", " ")}
                </label>
                ))}
            </div>
            </div>


        <button
          onClick={createUser}
          className="mt-3 bg-green-600 text-white px-4 font-semibold py-1 rounded-lg hover:bg-green-700"
        >
          Create User
        </button>
      </div>

      {/* Existing Users */}
      <div className="bg-white p-4 rounded-2xl shadow border border-green-200">
        <h3 className="text-lg font-semibold text-green-700 mb-2">
          Existing Users
        </h3>
        <table className="w-full border border-green-300">
          <thead>
            <tr className="bg-green-100 text-green-800">
              <th className="border p-1">User ID</th>
              <th className="border p-1">Name</th>
              <th className="border p-1">Role</th>
              <th className="border p-1">Permissions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-green-50">
                <td className="border p-1">{u.userId}</td>
                <td className="border p-1">{u.name}</td>
                <td className="border p-1">{u.role}</td>
                <td className="border p-1">{u.permissions.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    </div>
  );
}
