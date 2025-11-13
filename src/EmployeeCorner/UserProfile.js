// File: UserProfile.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UserProfile = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/employees")
      .then((res) => {
        setEmployees(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load Employee Data");
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Employee Details</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : employees.length === 0 ? (
        <p className="text-center text-gray-500">No employee data found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">First Name</th>
                <th className="py-2 px-4 border">Last Name</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Phone</th>
                <th className="py-2 px-4 border">Department</th>
                <th className="py-2 px-4 border">Designation</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id} className="text-center hover:bg-gray-100">
                  <td className="py-2 px-4 border">{emp.employeeID}</td>
                  <td className="py-2 px-4 border">{emp.firstName}</td>
                  <td className="py-2 px-4 border">{emp.lastName}</td>
                  <td className="py-2 px-4 border">{emp.permanentAddress.email}</td>
                  <td className="py-2 px-4 border">{emp.phone}</td>
                  <td className="py-2 px-4 border">{emp.department}</td>
                  <td className="py-2 px-4 border">{emp.designation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
