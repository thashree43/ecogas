// src/components/Dashboard.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from "./Sidebar";
import UserList from '../Userlisting';
import AgentList from '../Agentlisting';
import OrdersPage from '../Orderlisting';
import CustomerExperience from '../CustomExp';
import SalesListing from '../Saleslisting';

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
          <Route path='customexp' element={<CustomerExperience onClose={function (): void {
            throw new Error('Function not implemented.');
          } }/>}/>
          <Route path='sales' element={<SalesListing/>}/>
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
