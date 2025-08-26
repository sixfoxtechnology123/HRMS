import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./component/HomePage";
import BackButton from "./component/BackButton";
import MasterPage from "./Master/MasterPage";
import DepartmentList from "./Master/DepartmentList";
import DepartmentMaster from "./Master/DepartmentMaster";
import DesignationMaster from "./Master/DesignationMaster";
import DesignationList from "./Master/DesignationList";
import LeaveTypeMaster from "./Master/leavetypemaster";
import LeaveTypeList from "./Master/leavetypelist";
import HolidayMaster from "./Master/HolidayMaster";
import HolidayList from "./Master/HolidayList";
import ShiftMaster from "./Master/Shiftmaster";
import ShiftList from "./Master/Shiftlist";
import PolicyMaster from "./Master/Policymaster";
import PolicyList from "./Master/PolicyList";
import LocationMaster from "./Master/LocationMaster";
import LocationList from "./Master/Locationlist";
import PayrollComponentMaster from "./Master/PayrollComponentMaster";
import PayrollComponentList from "./Master/PayrollComponentList";
import EmployeeMaster from "./Master/EmployeeMaster";
import EmployeeList from "./Master/EmployeeList";
import Dashboard from "./component/Dashboard";


export default function App(){
  return (
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/BackButton" element={<BackButton/>} />
      <Route path="/MasterPage" element={<MasterPage/>} />
      <Route path="/DepartmentList" element={<DepartmentList/>} />
      <Route path="/DepartmentMaster" element={<DepartmentMaster/>} />
      <Route path="/DesignationMaster" element={<DesignationMaster/>} />
      <Route path="/DesignationList" element={<DesignationList/>} />
      <Route path="/LeaveTypeMaster" element={<LeaveTypeMaster/>} />
      <Route path="/LeaveTypeList" element={<LeaveTypeList/>} />
      <Route path="/HolidayMaster" element={<HolidayMaster/>} />
      <Route path="/HolidayList" element={<HolidayList/>} />
      <Route path="/ShiftMaster" element={<ShiftMaster/>} />
      <Route path="/ShiftList" element={<ShiftList/>} />
      <Route path="/PolicyMaster" element={<PolicyMaster/>} />
      <Route path="/PolicyList" element={<PolicyList/>} />
      <Route path="/LocationMaster" element={<LocationMaster/>} />
      <Route path="/LocationList" element={<LocationList/>} />
      <Route path="/PayrollComponentMaster" element={<PayrollComponentMaster/>} />
      <Route path="/PayrollComponentList" element={<PayrollComponentList/>} />
      <Route path="/EmployeeMaster" element={<EmployeeMaster/>} />
      <Route path="/EmployeeList" element={<EmployeeList/>} />
      <Route path="/Dashboard" element={<Dashboard/>} />
    </Routes>
  );
}
