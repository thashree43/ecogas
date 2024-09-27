import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../compnents/admin/Login";
import Maindashboard from "../compnents/admin/dashboard/MainDash";
import AdminverifyROute from "./protectroute/AdminVerifyRoute";
import AdminProtectRoute from "./protectroute/AdminProtectRoute";

const Adminroute: React.FC = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminverifyROute component={Login} />} />
      <Route path="dashboard/*" element={<AdminProtectRoute component={ Maindashboard } />}/>
    </Routes>
  );
};

export default Adminroute;
