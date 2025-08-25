import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../component/BackButton";
import { useLocation, useNavigate } from "react-router-dom";

const EmployeeMaster = () => {
  const [employeeID, setEmployeeID] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState("");
  const [doj, setDoj] = useState("");
  const [departmentID, setDepartmentID] = useState("");
  const [designationID, setDesignationID] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [workLocation, setWorkLocation] = useState("Office");
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");
  const [reportingManagerID, setReportingManagerID] = useState("");
  const [status, setStatus] = useState("Active");

  // NORMALIZED masters
  const [departments, setDepartments] = useState([]); // [{id, name}]
  const [designations, setDesignations] = useState([]); // pass-through (uses designationID/designationName)
  const [managers, setManagers] = useState([]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadMasters = async () => {
      try {
        const [deptRes, desigRes, mgrRes] = await Promise.all([
          axios.get("http://localhost:5001/api/departments"),
          axios.get("http://localhost:5001/api/designations"),
          axios.get("http://localhost:5001/api/employees/managers"),
        ]);

        // --- Normalize departments to { id, name } ---
        const depts = (deptRes.data || [])
          .map((d) => ({
            id:
              d.departmentID ||
              d.deptCode ||
              d.code ||
              d.id ||
              "", // code to store
            name:
              d.departmentName ||
              d.deptName ||
              d.name ||
              "", // human name to show
          }))
          .filter((x) => x.id && x.name);
        setDepartments(depts);

        setDesignations(desigRes.data || []);
        setManagers(mgrRes.data || []);
      } catch (e) {
        console.error("Master fetch error:", e);
      }
    };
    loadMasters();

    if (location.state?.employee) {
      const e = location.state.employee;
      setEmployeeID(e.employeeID);
      setFirstName(e.firstName || "");
      setLastName(e.lastName || "");
      setGender(e.gender || "Male");
      setDob(e.dob ? e.dob.substring(0, 10) : "");
      setDoj(e.doj ? e.doj.substring(0, 10) : "");
      setDepartmentID(e.departmentID || ""); // will be the code
      setDesignationID(e.designationID || "");
      setEmploymentType(e.employmentType || "Full-time");
      setWorkLocation(e.workLocation || "Office");
      setContactNo(e.contactNo || "");
      setEmail(e.email || "");
      setReportingManagerID(e.reportingManagerID || "");
      setStatus(e.status || "Active");
      setEditId(e._id);
      setIsEditMode(true);
    } else {
      fetchNextEmployeeID();
      setIsEditMode(false);
    }
  }, [location.state]);

  const fetchNextEmployeeID = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/employees/next-id");
      setEmployeeID(res.data.employeeID);
    } catch (e) {
      console.error("Next ID error:", e);
    }
  };

  const validate = () => {
    if (!firstName.trim() || !lastName.trim() || !dob || !doj || !departmentID || !designationID) {
      alert("Please fill all required fields (*)");
      return false;
    }
    if (contactNo && !/^\d{10,15}$/.test(contactNo)) {
      alert("Contact No must be 10–15 digits");
      return false;
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      alert("Please enter a valid email");
      return false;
    }
    return true;
  };

  const handleSaveOrUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        employeeID,
        firstName,
        lastName,
        gender,
        dob,
        doj,
        departmentID,  // code only
        designationID, // code only
        employmentType,
        workLocation,
        contactNo,
        email,
        reportingManagerID: reportingManagerID || null,
        status,
      };

      if (isEditMode) {
        await axios.put(`http://localhost:5001/api/employees/${editId}`, payload);
        alert("Employee updated successfully");
      } else {
        await axios.post("http://localhost:5001/api/employees", payload);
        alert("Employee saved successfully");
      }
      navigate("/employeeList", { replace: true });
    } catch (err) {
      console.error("Save/Update Error:", err);
      alert("Failed to save/update employee");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">
          {isEditMode ? "Update Employee" : "Employee"}
        </h2>

        <form
          onSubmit={handleSaveOrUpdate}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div>
            <label className="block font-medium">Employee ID</label>
            <input
              type="text"
              value={employeeID}
              readOnly
              className="w-full border border-gray-300 p-1 rounded bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-medium">First Name *</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-1 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Last Name *</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-1 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-1 border rounded"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">DOB *</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full p-1 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium">DOJ *</label>
            <input
              type="date"
              value={doj}
              onChange={(e) => setDoj(e.target.value)}
              className="w-full p-1 border rounded"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block font-medium">Department *</label>
            <select
              value={departmentID}
              onChange={(e) => setDepartmentID(e.target.value)}
              className="w-full p-1 border rounded"
            >
              <option value="">-- Select Department --</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} - {d.id}
                </option>
              ))}
            </select>
          </div>

          {/* Designation */}
          <div>
            <label className="block font-medium">Designation *</label>
            <select
              value={designationID}
              onChange={(e) => setDesignationID(e.target.value)}
              className="w-full p-1 border rounded"
            >
              <option value="">-- Select Designation --</option>
              {designations.map((d) => (
                <option key={d._id || d.designationID} value={d.designationID}>
                  {d.designationName} - {d.designationID}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Employment Type</label>
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className="w-full p-1 border rounded"
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Work Location</label>
            <select
              value={workLocation}
              onChange={(e) => setWorkLocation(e.target.value)}
              className="w-full p-1 border rounded"
            >
              <option>Office</option>
              <option>Remote</option>
              <option>Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Contact No *</label>
            <input
              type="text"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
              className="w-full p-1 border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-1 border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Reporting Manager</label>
            <select
              value={reportingManagerID}
              onChange={(e) => setReportingManagerID(e.target.value)}
              className="w-full p-1 border rounded"
            >
              <option value="">-- Select Manager --</option>
              {managers.map((m) => (
                <option key={m._id} value={m.employeeID}>
                  {m.employeeID} - {m.firstName} {m.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-1 border rounded"
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>Resigned</option>
              <option>Terminated</option>
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

export default EmployeeMaster;
