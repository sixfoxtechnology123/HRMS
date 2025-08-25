import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa";
import BackButton from "../component/BackButton";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]); // normalized: [{id, name}]
  const [designations, setDesignations] = useState([]);
  const navigate = useNavigate();

  const fetchAll = async () => {
    try {
      const [empRes, deptRes, desigRes] = await Promise.all([
        axios.get("http://localhost:5001/api/employees"),
        axios.get("http://localhost:5001/api/departments"),
        axios.get("http://localhost:5001/api/designations"),
      ]);

      setEmployees(empRes.data || []);

      // normalize departments to {id, name}
      const depts = (deptRes.data || [])
        .map((d) => ({
          id:
            d.departmentID ||
            d.deptCode ||
            d.code ||
            d.id ||
            "",
          name:
            d.departmentName ||
            d.deptName ||
            d.name ||
            "",
        }))
        .filter((x) => x.id && x.name);
      setDepartments(depts);

      setDesignations(desigRes.data || []);
    } catch (e) {
      console.error("Fetch error:", e);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const deptMap = useMemo(() => {
    const m = {};
    departments.forEach((d) => (m[d.id] = d.name)); // code -> name
    return m;
  }, [departments]);

  const desigMap = useMemo(() => {
    const m = {};
    designations.forEach((d) => (m[d.designationID] = d.designationName));
    return m;
  }, [designations]);

  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axios.delete(`http://localhost:5001/api/employees/${id}`);
      setEmployees((prev) => prev.filter((e) => e._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <div className="bg-green-50 border border-green-300 rounded-lg shadow-md p-2 mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-green-800">Employee List</h2>
        <div className="flex gap-2">
          <BackButton />
          <button
            onClick={() => navigate("/EmployeeMaster")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded font-semibold whitespace-nowrap"
          >
            Add Employee
          </button>
        </div>
      </div>

      <table className="w-full table-auto border border-green-500">
        <thead className="bg-gray-200 text-sm">
          <tr>
            <th className="border border-green-500 px-2 py-1">Emp ID</th>
            <th className="border border-green-500 px-2 py-1">Name</th>
            <th className="border border-green-500 px-2 py-1">Email</th>
            <th className="border border-green-500 px-2 py-1">Department</th>
            <th className="border border-green-500 px-2 py-1">Designation</th>
            <th className="border border-green-500 px-2 py-1">Employment</th>
            <th className="border border-green-500 px-2 py-1">Work Location</th>
            <th className="border border-green-500 px-2 py-1">Contact</th>
            <th className="border border-green-500 px-2 py-1">Status</th>
            <th className="border border-green-500 px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm text-center">
          {employees.length ? (
            employees.map((e) => (
              <tr key={e._id} className="hover:bg-gray-100 transition">
                <td className="border border-green-500 px-2 py-1">{e.employeeID}</td>
                <td className="border border-green-500 px-2 py-1">
                  {e.firstName} {e.lastName}
                </td>
                <td className="border border-green-500 px-2 py-1">{e.email}</td>

                {/* Show ONLY department name (from code) */}
                <td className="border border-green-500 px-2 py-1">
                  {deptMap[e.departmentID] || e.departmentID}
                </td>

                <td className="border border-green-500 px-2 py-1">
                  {desigMap[e.designationID] || e.designationID}
                </td>
                <td className="border border-green-500 px-2 py-1">{e.employmentType}</td>
                <td className="border border-green-500 px-2 py-1">{e.workLocation}</td>
                <td className="border border-green-500 px-2 py-1">{e.contactNo}</td>
                <td className="border border-green-500 px-2 py-1">{e.status}</td>
                <td className="border border-green-500 px-2 py-1">
                  <div className="flex justify-center gap-8">
                    <button
                      onClick={() => navigate("/employeeMaster", { state: { employee: e } })}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteEmployee(e._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center py-4 text-gray-500">
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
