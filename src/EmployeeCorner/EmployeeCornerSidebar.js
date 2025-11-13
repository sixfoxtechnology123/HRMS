import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, CalendarDays, FileText, Clock, Wallet, Menu, X, ArrowBigRightDash, ArrowBigLeftDash, LogOut } from "lucide-react";

const EmployeeCornerSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const menus = [
    { name: "Dashboard", path: "/employeeHome", icon: LayoutDashboard },
    {
      name: "Employee Access",
      icon: Users,
      submenus: [
        { name: "User Profile", path: "/userProfile", icon: Users },
        { name: "Holiday Calendar", path: "/holidayCalendar", icon: CalendarDays },
        { name: "Leave Application", path: "/leaveApplication", icon: FileText },
        { name: "Employee Pay Slip", path: "/paySlip", icon: Wallet },
        { name: "HR Policy", path: "/hrPolicy", icon: Clock },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("employeeData");
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
      return menu.submenus.some(sub => location.pathname === sub.path);
    }
    return false;
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-gray-800 text-white p-3">
        <h2 className=" font-bold">Employee Corner</h2>
        <button onClick={() => setMobileOpen(true)}> <Menu size={28} /> </button>
      </div>

      {/* Sidebar */}
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

          {isOpen && <h2 className="hidden md:block text-xl font-bold mb-1 px-4">Employee Corner</h2>}

          <ul className="space-y-2 px-2 flex-1 overflow-y-auto">
            {menus.map((menu, i) => {
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

                  {/* Submenus */}
                  {open && menu.submenus && (
                    <ul className="pl-8 space-y-1 mt-1">
                      {menu.submenus.map((sub, j) => (
                        <li key={j}>
                          <NavLink
                            to={sub.path}
                            className={({ isActive }) =>
                              `flex items-center gap-3 p-1 rounded text-sm ${
                                isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                              }`
                            }
                            onClick={() => setMobileOpen(false)}
                          >
                            <sub.icon size={18} />
                            {isOpen && <span>{sub.name}</span>}
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

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-40 md:hidden" onClick={() => setMobileOpen(false)}></div>
      )}
    </>
  );
};

export default EmployeeCornerSidebar;
