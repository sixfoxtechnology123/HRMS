import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard, UserCog, Briefcase, IdCard, CalendarDays, CalendarRange,
  Wallet, Clock4, Building2, FileText, ChevronRight, Bell, Search
} from "lucide-react";

const masterItems = [
  { key: "dashboard", label: "Dashboard", to: "/", icon: <LayoutDashboard className="h-5 w-5" /> },
  { key: "employeeMaster", label: "Employee Master", to: "/masters/employee", icon: <UserCog className="h-5 w-5" /> },
  { key: "departmentMaster", label: "Department Master", to: "/masters/department", icon: <Briefcase className="h-5 w-5" /> },
  { key: "designationMaster", label: "Designation Master", to: "/masters/designation", icon: <IdCard className="h-5 w-5" /> },
  { key: "leaveTypeMaster", label: "Leave Type Master", to: "/masters/leave-type", icon: <CalendarDays className="h-5 w-5" /> },
  { key: "holidayMaster", label: "Holiday Master", to: "/masters/holiday", icon: <CalendarRange className="h-5 w-5" /> },
  { key: "payrollComponentMaster", label: "Payroll Component Master", to: "/masters/payroll-component", icon: <Wallet className="h-5 w-5" /> },
  { key: "shiftMaster", label: "Shift Master", to: "/masters/shift", icon: <Clock4 className="h-5 w-5" /> },
  { key: "locationMaster", label: "Location / Branch Master", to: "/masters/location", icon: <Building2 className="h-5 w-5" /> },
  { key: "policyMaster", label: "Policy Master", to: "/masters/policy", icon: <FileText className="h-5 w-5" /> },
];

export default function Layout() {
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Topbar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setOpen(o => !o)} 
            className="rounded border px-2 py-1 lg:hidden transition-transform duration-300"
          >
            <ChevronRight className={`h-5 w-5 transform transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-indigo-600 text-white">SF</div>
            <div className="text-lg font-semibold">SixFox HRMS</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 border rounded px-3 py-1">
            <Search className="h-4 w-4 text-gray-400" />
            <input placeholder="Search…" className="outline-none w-64" />
          </div>
          <button className="rounded border p-2 hover:bg-gray-50 transition"><Bell className="h-5 w-5" /></button>
          <div className="flex items-center gap-2 rounded bg-gray-100 px-3 py-1">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700" />
            <span className="text-sm font-medium">Hi, Admin</span>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[260px_1fr] transition-all duration-300">
        {/* Sidebar */}
        <aside className={`border-r bg-white p-3 lg:h-[calc(100vh-57px)] transition-all duration-300 ${open ? "w-64" : "w-16 overflow-hidden"}`}>
          <nav className="space-y-1">
            {masterItems.map(mi => (
              <NavLink
                key={mi.key}
                to={mi.to}
                className={({isActive}) => `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors duration-200 ${isActive ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-50"}`}
              >
                {mi.icon}
                <span className={`${open ? "inline" : "hidden"}`}>{mi.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
