import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "../component/Sidebar"; 

const Dashboard = () => {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/dashboard/counts")
      .then((res) => setCounts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const cards = [
    { title: "Employees", value: counts.employees, path: "/EmployeeList" },
    { title: "Departments", value: counts.departments, path: "/DepartmentList" },
    { title: "Designations", value: counts.designations, path: "/DesignationList" },
    { title: "Leave Types", value: counts.leaveTypes, path: "/LeaveTypeList" },
    { title: "Holidays", value: counts.holidays, path: "/HolidayList" },
    { title: "Shifts", value: counts.shifts, path: "/ShiftList" },
    { title: "Policies", value: counts.policies, path: "/PolicyList" },
    { title: "Locations", value: counts.locations, path: "/LocationList" },
    { title: "Payroll Components", value: counts.payrollComponents, path: "/PayrollComponentList" },
  ];

  return (
    <div className="flex min-h-screen flex-col  md:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 min-h-screen p-6 w-full">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="bg-white shadow rounded px-4 py-2">Admin</div>
        </header>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cards.map((c, i) => (
            <Link key={i} to={c.path}>
              <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-xl transition cursor-pointer">
                <h2 className="text-lg font-medium">{c.title}</h2>
                <p className="text-3xl font-bold mt-2">{c.value ?? 0}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
