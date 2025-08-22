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
    </Routes>
  );
}
