import React from "react";
import EmployeeCornerSidebar from "./EmployeeCornerSidebar";

const EmployeeHome = () => {
  return (
     <div className="min-h-screen bg-zinc-300 flex">
      <EmployeeCornerSidebar/>
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="bg-white min-h-screen shadow-lg rounded-lg p-4 w-full">
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold text-gray-700">
        Employee Home
      </h1>
    </div>
    </div>
    </div>
    </div>
  );
};

export default EmployeeHome;
