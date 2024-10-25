import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Applicationpage from "../compnents/broker/Applicationpage";
import AgentLoginForm from "../compnents/broker/AgentLogin";
import AgentVerifyRoute from "../routes/protectroute/AgentVerifyRoute";
import AgentProtectRoute from "../routes/protectroute/AgentProtectRoute";
import Agentdashboard from "../compnents/broker/dashboardcontents/Agentdashboard"
const BrokerRoute: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/agent/login" replace />} />
      <Route path="/apply" element={<Applicationpage />} />
      <Route
        path="/login"
        element={
          <AgentVerifyRoute component={AgentLoginForm} />
        }
      />
      {/* <Route
        path="/dash/*"
        element={
          <AgentProtectRoute component={AgentDashboard} />
        }
      /> */}
      <Route
        path="/dashboard/*"
        element={
          <AgentProtectRoute component={Agentdashboard} />
        }
      />
      <Route path="*" element={<Navigate to="/agent/login" replace />} />
    </Routes>
  );
};

export default BrokerRoute;