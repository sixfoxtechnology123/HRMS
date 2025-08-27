import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";

// Icons
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
  Activity,
} from "lucide-react";

// Default avatar
import defaultAvatar from "../assets/avatar.jpg";

const Dashboard = () => {
  const [counts, setCounts] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem("adminData")) || {});
  const [activities, setActivities] = useState([]);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  // Fetch dashboard counts
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/dashboard/counts")
      .then((res) => setCounts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch recent activities
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/dashboard/activities")
      .then((res) => {
        const formattedActivities = res.data.map((a) => {
          const dateObj = new Date(a.createdAt || new Date());
          const formattedTime = dateObj.toLocaleString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
          return { ...a, formattedTime };
        });
        setActivities(formattedActivities);
      })
      .catch((err) => {
        console.error("Error fetching activities:", err);
        setActivities([]);
      });
  }, []);

  // Sync admin data from localStorage
  useEffect(() => {
    const updateAdminData = () => {
      const data = localStorage.getItem("adminData");
      if (data) setAdmin(JSON.parse(data));
    };
    updateAdminData();
    window.addEventListener("storage", updateAdminData);
    return () => window.removeEventListener("storage", updateAdminData);
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminData");
    localStorage.removeItem("token");
    navigate("/");
  };

  const cards = [
    { title: "Employees", value: counts.employees, path: "/EmployeeList", color: "bg-blue-500 text-white", icon: Users },
    { title: "Departments", value: counts.departments, path: "/DepartmentList", color: "bg-green-500 text-white", icon: Building2 },
    { title: "Designations", value: counts.designations, path: "/DesignationList", color: "bg-purple-500 text-white", icon: Briefcase },
    { title: "Leave Types", value: counts.leaveTypes, path: "/LeaveTypeList", color: "bg-pink-500 text-white", icon: Calendar },
    { title: "Holidays", value: counts.holidays, path: "/HolidayList", color: "bg-red-500 text-white", icon: CalendarDays },
    { title: "Shifts", value: counts.shifts, path: "/ShiftList", color: "bg-yellow-500 text-gray-900", icon: Clock },
    { title: "Policies", value: counts.policies, path: "/PolicyList", color: "bg-indigo-500 text-white", icon: FileText },
    { title: "Locations", value: counts.locations, path: "/LocationList", color: "bg-teal-500 text-white", icon: MapPin },
    { title: "Payroll Components", value: counts.payrollComponents, path: "/PayrollComponentList", color: "bg-orange-500 text-white", icon: Wallet },
  ];

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 bg-green-100 min-h-screen p-4 w-full">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Dashboard</h1>

          <div className="relative flex items-center gap-3" ref={dropdownRef}>
            <span className="font-medium text-gray-700">{admin?.name ?? "Admin"}</span>
            <img
              onClick={() => setDropdownOpen(!dropdownOpen)}
              src={admin?.profileImage ? `http://localhost:5001/${admin.profileImage}` : defaultAvatar}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-12 w-48 bg-white border rounded shadow-lg z-50">
                <ul className="flex flex-col">
                  <li>
                    <Link to="/EditProfile" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Edit Profile</Link>
                  </li>
                  <li>
                    <Link to="/ChangePassword" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>Change Password</Link>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((c, i) => {
              const Icon = c.icon;
              return (
                <Link key={i} to={c.path} className="flex justify-center">
                  <div className={`w-56 rounded-lg p-3 text-center shadow-md hover:shadow-xl transition cursor-pointer ${c.color}`}>
                    <div className="flex justify-center mb-3"><Icon size={32} /></div>
                    <h2 className="text-lg font-medium">{c.title}</h2>
                    <p className="text-3xl font-bold mt-2">{c.value ?? 0}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right Side - Recent Activities */}
          <div className="bg-white p-2 rounded-lg shadow w-full text-sm">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
              <Activity size={20} /> Recent Activities
            </h3>
            <ul className="space-y-2 max-h-72 overflow-y-auto">
              {activities.length > 0 ? (
                activities.map((a) => (
                  <li key={a._id} className="p-2 border rounded hover:bg-gray-50">
                    <div>{a.text}</div>
                    <div className="text-xs text-gray-400 mt-1">{a.formattedTime}</div>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No recent activities</p>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
