import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
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
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [role, setRole] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("adminData")) || {};
    setPermissions(admin.permissions || []);
    setRole(admin.role || "");

    // Initialize openMenu if current path is inside a submenu
    const leaveMenuPaths = [
      "/LeaveDashboard",
      "/LeaveTypeList",
      "/LeaveRule",
      "/LeaveAllocation",
      "/LeaveBalance",
      "/LeaveReport",
    ];
    if (leaveMenuPaths.includes(location.pathname)) {
      setOpenMenu("Leave Management");
    }
  }, [location.pathname]);

  const menus = [
    { name: "Dashboard", path: "/Dashboard", icon: LayoutDashboard, permission: "Dashboard_View" },
    { name: "New Employee Reg", path: "/EmployeeList", icon: Users, permission: "Employee_View" },
    { name: "Departments", path: "/DepartmentList", icon: Building2, permission: "Department_View" },
    { name: "Designations", path: "/DesignationList", icon: Briefcase, permission: "Designation_View" },
    {
      name: "Leave Management",
      icon: Calendar,
      permission: "Leave_Manage",
      submenus: [
        { name: "Dashboard", path: "/LeaveDashboard" },
        { name: "Manage Leave Type", path: "/LeaveTypeList" },
        { name: "Leave Rule", path: "/LeaveRuleList" },
        { name: "Leave Allocation", path: "/LeaveAllocationList" },
        { name: "Leave Balance", path: "/LeaveBalance" },
        { name: "Leave Report", path: "/LeaveReport" },
      ],
    },
    { name: "Holidays", path: "/HolidayList", icon: CalendarDays, permission: "Holiday_Manage" },
    { name: "Shifts", path: "/ShiftList", icon: Clock, permission: "Shift_Manage" },
    { name: "Policies", path: "/PolicyList", icon: FileText, permission: "Policy_Manage" },
    { name: "Locations", path: "/LocationList", icon: MapPin, permission: "Location_Manage" },
    { name: "Payroll", path: "/PayrollComponentList", icon: Wallet, permission: "Payroll_Manage" },
    { name: "Admin Management", path: "/AdminManagement", icon: Users, permission: "Admin_Management" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminData");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleMenuClick = (menu) => {
    if (menu.submenus) {
      setOpenMenu(openMenu === menu.name ? null : menu.name);
    } else {
      navigate(menu.path);
      setMobileOpen(false);
    }
  };

  const isMenuActive = (menu) => {
    if (menu.path && location.pathname === menu.path) return true;
    if (menu.submenus) {
      return menu.submenus.some((sub) => location.pathname === sub.path);
    }
    return false;
  };

  return (
    <>
      <div className="md:hidden flex items-center justify-between bg-gray-800 text-white p-3">
        <h2 className="text-lg font-bold">HRMS</h2>
        <button onClick={() => setMobileOpen(true)}> <Menu size={28} /> </button>
      </div>

      <div
        className={`fixed inset-y-0 left-0 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out z-50
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
        md:static md:translate-x-0 md:flex md:flex-col
        ${isOpen ? "md:w-56" : "md:w-16"} 
        md:min-h-screen`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-1 p-1">
            <button className="hidden md:block text-white" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <ArrowBigLeftDash size={22} /> : <ArrowBigRightDash size={22} />}
            </button>
            <button className="md:hidden text-white ml-auto" onClick={() => setMobileOpen(false)}>
              <X size={28} />
            </button>
          </div>

          {isOpen && <h2 className="hidden md:block text-2xl font-bold mb-1 px-4">HRMS</h2>}

          <ul className="space-y-2 px-2 flex-1 overflow-y-auto">
            {menus
              .filter(menu => role === "Admin" || permissions.includes(menu.permission))
              .map((menu, i) => {
                const Icon = menu.icon;
                const active = isMenuActive(menu);
                const open = openMenu === menu.name;

                return (
                  <li key={i}>
                    <button
                      onClick={() => handleMenuClick(menu)}
                      className={`flex items-center gap-3 p-1 w-full text-left rounded transition-colors ${
                        active ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                      }`}
                    >
                      <Icon size={20} />
                      {isOpen && <span>{menu.name}</span>}
                    </button>

                    {open && menu.submenus && (
                      <ul className="pl-8 space-y-1 mt-1">
                        {menu.submenus.map((sub, j) => (
                          <li key={j}>
                            <NavLink
                              to={sub.path}
                              className={({ isActive }) =>
                                `block p-1 rounded text-sm ${
                                  isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                                }`
                              }
                              onClick={() => setMobileOpen(false)} // Only close mobile, do not touch openMenu
                            >
                              {isOpen && sub.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
          </ul>

          <div className="px-2 mb-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full bg-red-600 text-white p-1 rounded transition"
            >
              <LogOut size={20} />
              {isOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-40 md:hidden" onClick={() => setMobileOpen(false)}></div>
      )}
    </>
  );
};

export default Sidebar;
