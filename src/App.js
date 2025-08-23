import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Master/Layout";
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


export default function App(){
  return (
    <Routes>
      <Route path="/Layout" element={<Layout/>} />
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
    </Routes>
  );
}
