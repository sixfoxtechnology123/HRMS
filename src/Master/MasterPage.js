import React from "react";
import { useNavigate } from "react-router-dom";
import { FaClinicMedical, FaUserTie } from "react-icons/fa"; // 🏥 for Department, 👔 for Designation

const MasterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-teal-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-10">Master Data</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-center">
        {/* Department Box */}
        <div
          className="group p-12 bg-white shadow-lg rounded-xl text-center cursor-pointer hover:bg-pink-100 transition"
          onClick={() => navigate("/DepartmentList")}
        >
          <FaClinicMedical size={60} className="mx-auto text-pink-600" />
          <h2 className="mt-6 text-2xl font-semibold transform transition-transform duration-300 group-hover:-translate-y-1">
            Department
          </h2>
        </div>

        {/* Designation Box */}
        <div
          className="group p-12 bg-white shadow-lg rounded-xl text-center cursor-pointer hover:bg-green-100 transition"
          onClick={() => navigate("/DesignationList")}
        >
          <FaUserTie size={60} className="mx-auto text-green-600" />
          <h2 className="mt-6 text-2xl font-semibold transform transition-transform duration-300 group-hover:-translate-y-1">
            Designation
          </h2>
        </div>
      </div>
    </div>
  );
};

export default MasterPage;
