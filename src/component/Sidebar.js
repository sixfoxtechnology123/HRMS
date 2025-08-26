import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Calendar,
  CalendarDays,
  Clock,
  FileText,
  MapPin,
  Wallet,
  Menu,
  X,
  ArrowBigRightDash,
  ArrowBigLeftDash,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menus = [
    { name: "Home", path: "/Homepage", icon: Home },
    { name: "Dashboard", path: "/Dashboard", icon: LayoutDashboard }, 
    { name: "New Employee Reg", path: "/EmployeeList", icon: Users },
    { name: "Departments", path: "/DepartmentList", icon: Building2 },
    { name: "Designations", path: "/DesignationList", icon: Briefcase },
    { name: "Leave Types", path: "/LeaveTypeList", icon: Calendar },
    { name: "Holidays", path: "/HolidayList", icon: CalendarDays },
    { name: "Shifts", path: "/ShiftList", icon: Clock },
    { name: "Policies", path: "/PolicyList", icon: FileText },
    { name: "Locations", path: "/LocationList", icon: MapPin },
    { name: "Payroll", path: "/PayrollComponentList", icon: Wallet },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-gray-800 text-white p-3">
        <h2 className="text-lg font-bold">HRMS</h2>
        <button onClick={() => setMobileOpen(true)}>
          <Menu size={28} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out z-50
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
        md:static md:translate-x-0 md:flex md:flex-col
        ${isOpen ? "md:w-56" : "md:w-16"} 
        md:min-h-screen`}
      >
        {/* Top Controls */}
        <div className="flex items-center justify-between mb-1 p-1">
          <button
            className="hidden md:block text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <ArrowBigLeftDash size={22} /> : <ArrowBigRightDash size={22} />}
          </button>
          <button
            className="md:hidden text-white ml-auto"
            onClick={() => setMobileOpen(false)}
          >
            <X size={28} />
          </button>
        </div>

        {isOpen && (
          <h2 className="hidden md:block text-2xl font-bold mb-1 px-4">
            HRMS
          </h2>
        )}

        {/* Menu Links */}
        <ul className="space-y-2 px-2">
          {menus.map((menu, i) => {
            const Icon = menu.icon;
            return (
              <li key={i}>
                <NavLink
                  to={menu.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-1 rounded transition-colors ${
                      isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                    }`
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={20} />
                  {isOpen && <span>{menu.name}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
