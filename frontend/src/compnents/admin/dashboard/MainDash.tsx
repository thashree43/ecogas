// src/components/Dashboard.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from "./Sidebar";
import UserList from '../Userlisting';
import AgentList from '../Agentlisting';
import OrdersPage from '../Orderlisting';
import CustomerExperience from '../CustomExp';

const Dashboard: React.FC = () => {
  return (
    <div style={dashboardContainerStyle}>
      <Sidebar />
      <div style={mainContentStyle}>
        <Routes>
          <Route path="/" element={<h2>Welcome to the Dashboard</h2>} />
          <Route path="users" element={<UserList />} />
          <Route path='agents' element={<AgentList/>} />
          <Route path='orders' element ={<OrdersPage/>}/>
          <Route path='customexp' element={<CustomerExperience/>}/>
        </Routes>
      </div>
    </div>
  );
};

const dashboardContainerStyle: React.CSSProperties = {
  display: 'flex'
};

const mainContentStyle: React.CSSProperties = {
  flexGrow: 1,
  padding: '20px'
};

export default Dashboard;
