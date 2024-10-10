import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from "../dashboard/Sidebarcomponent";
import ProductList from '../Productlistingpage';
import OrderList from '../Orderlistingagent';

const Dashboard: React.FC = () => {
  const agentName = localStorage.getItem("agentname") || "Agent";

  return (
    <div style={dashboardContainerStyle}>
      <Sidebar />
      <div style={mainContentStyle}>
        <header style={headerStyle}>
          <h1 style={headerTitleStyle}>Welcome, {}!</h1>
        </header>
        <div style={contentStyle}>
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="/company" element={<ProductList />} />
            <Route path='/orders' element={<OrderList/>}/>
          </Routes>
        </div>
      </div>
    </div>
  );
};

const DashboardHome: React.FC = () => (
  <div>
    <h2 style={sectionTitleStyle}>Dashboard Overview</h2>
    <div style={cardContainerStyle}>
      <div style={cardStyle}>
        <h3>Total Users</h3>
        <p style={cardNumberStyle}>1,234</p>
      </div>
      <div style={cardStyle}>
        <h3>Active Brokers</h3>
        <p style={cardNumberStyle}>56</p>
      </div>
      <div style={cardStyle}>
        <h3>Revenue</h3>
        <p style={cardNumberStyle}>$12,345</p>
      </div>
    </div>
  </div>
);

const dashboardContainerStyle: React.CSSProperties = {
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f0f3f6',
};

const mainContentStyle: React.CSSProperties = {
  flexGrow: 1,
  padding: '30px',
  overflowY: 'auto',
};

const headerStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '20px 30px',
  marginBottom: '30px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const headerTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.8rem',
  color: '#2c3e50',
};

const contentStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  marginBottom: '20px',
  color: '#2c3e50',
};

const cardContainerStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
};

const cardNumberStyle: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 'bold',
  margin: '10px 0 0',
  color: '#3498db',
};

export default Dashboard;