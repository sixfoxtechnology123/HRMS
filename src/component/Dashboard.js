import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";

// Import icons
import {
  Users,
  Building2,
  Briefcase,
  Calendar,
  CalendarDays,
  Clock,
  FileText,
  MapPin,
  Wallet,
} from "lucide-react";

// Import default avatar
import defaultAvatar from "../assets/avatar.jpg";

const Dashboard = () => {
  const [counts, setCounts] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [admin, setAdmin] = useState(
    JSON.parse(localStorage.getItem("adminData")) || {}
  );
  const dropdownRef = useRef();
  const navigate = useNavigate();

  // Fetch dashboard counts
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/dashboard/counts")
      .then((res) => setCounts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Sync admin data from localStorage whenever it changes
  useEffect(() => {
    const updateAdminData = () => {
      const data = localStorage.getItem("adminData");
      if (data) {
        setAdmin(JSON.parse(data));
      }
    };

    // Run once on mount
    updateAdminData();

    // Listen for storage changes across tabs
    window.addEventListener("storage", updateAdminData);

    return () => {
      window.removeEventListener("storage", updateAdminData);
    };
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminData");
    localStorage.removeItem("token");
    navigate("/");
  };

  const cards = [
    {
      title: "Employees",
      value: counts.employees,
      path: "/EmployeeList",
      color: "bg-blue-500 text-white",
      icon: Users,
    },
    {
      title: "Departments",
      value: counts.departments,
      path: "/DepartmentList",
      color: "bg-green-500 text-white",
      icon: Building2,
    },
    {
      title: "Designations",
      value: counts.designations,
      path: "/DesignationList",
      color: "bg-purple-500 text-white",
      icon: Briefcase,
    },
    {
      title: "Leave Types",
      value: counts.leaveTypes,
      path: "/LeaveTypeList",
      color: "bg-pink-500 text-white",
      icon: Calendar,
    },
    {
      title: "Holidays",
      value: counts.holidays,
      path: "/HolidayList",
      color: "bg-red-500 text-white",
      icon: CalendarDays,
    },
    {
      title: "Shifts",
      value: counts.shifts,
      path: "/ShiftList",
      color: "bg-yellow-500 text-gray-900",
      icon: Clock,
    },
    {
      title: "Policies",
      value: counts.policies,
      path: "/PolicyList",
      color: "bg-indigo-500 text-white",
      icon: FileText,
    },
    {
      title: "Locations",
      value: counts.locations,
      path: "/LocationList",
      color: "bg-teal-500 text-white",
      icon: MapPin,
    },
    {
      title: "Payroll Components",
      value: counts.payrollComponents,
      path: "/PayrollComponentList",
      color: "bg-orange-500 text-white",
      icon: Wallet,
    },
  ];

  return (
   <div className="flex min-h-screen flex-col md:flex-row">
  {/* Sidebar */}
  <Sidebar />

  {/* Main Content */}
  <main className="flex-1 bg-gray-100 min-h-screen p-6 w-full">
    <header className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Profile Dropdown */}
      <div className="relative flex items-center gap-3" ref={dropdownRef}>
        {/* Name */}
        <span className="font-medium text-gray-700">
          {admin?.name ?? "Admin"}
        </span>

        {/* Profile Image */}
        <img
          onClick={() => setDropdownOpen(!dropdownOpen)}
          src={
            admin?.profileImage
              ? `http://localhost:5001/${admin.profileImage}`
              : defaultAvatar
          }
          alt="profile"
          className="w-10 h-10 rounded-full object-cover cursor-pointer"
        />

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-12 w-48 bg-white border rounded shadow-lg z-50">
            <ul className="flex flex-col">
              <li>
                <Link
                  to="/EditProfile"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Edit Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/ChangePassword"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Change Password
                </Link>
              </li>
              <li>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>

    {/* Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <Link key={i} to={c.path} className="flex justify-center">
            <div
              className={`w-56 rounded-lg p-3 text-center shadow-md hover:shadow-xl transition cursor-pointer ${c.color}`}
            >
              <div className="flex justify-center mb-3">
                <Icon
                  size={32}
                  className="transition-transform duration-300 transform group-hover:scale-110"
                />
              </div>
              <h2 className="text-lg font-medium">{c.title}</h2>
              <p className="text-3xl font-bold mt-2">{c.value ?? 0}</p>
            </div>
          </Link>
        );
      })}
    </div>
  </main>
</div>

  );
};

export default Dashboard;
