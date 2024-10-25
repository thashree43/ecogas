import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from "./Sidebar";
import UserList from '../Userlisting';
import AgentList from '../Agentlisting';
import OrdersPage from '../Orderlisting';
import CustomerExperience from '../CustomExp';
import SalesListing from '../Saleslisting';
import { useAdmindashboardQuery } from "../../../store/slice/Adminslice.ts";
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { AdminDashboardData } from "../../../interfacetypes/type.ts";

const Dashboard: React.FC = () => {
  const { data: dashboardData, isLoading, error } = useAdmindashboardQuery();

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Error loading dashboard data</div>;

  const { totalOrdersAmount, totalProfit, monthlySales, totalAgentCount, totalOrdersCount } = dashboardData as unknown as AdminDashboardData;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const barChartData = {
    labels: monthNames,
    datasets: [{
      label: 'Monthly Sales',
      data: monthNames.map((_, index) => {
        const sale = monthlySales?.find((sale) => parseInt(sale.month) === index + 1);
        return sale ? sale.totalOrdersAmount : 0;
      }) || [],
      backgroundColor: '#8B5CF6',
      borderRadius: 4
    }]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          borderDash: [2],
          color: '#E5E7EB'
        },
        ticks: {
          stepSize: 6000
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  const pieChartData = {
    labels: monthlySales?.map((sale) => {
      const monthNumber = parseInt(sale.month);
      return monthNumber >= 1 && monthNumber <= 12
        ? new Date(0, monthNumber - 1).toLocaleString('default', { month: 'long' }) + `: ₹${sale.totalProfit.toFixed(2)}`
        : '';
    }) || [],
    datasets: [{
      data: monthlySales?.map((sale) => sale.totalProfit) || [],
      backgroundColor: ['#3B82F6', '#F59E0B', '#34D399', '#FBBF24', '#FB7185', '#F472B6', '#A78BFA', '#EAB308', '#C084FC', '#EAB8B0', '#B91C1C', '#9333EA'],
      borderWidth: 0
    }]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 20
        }
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <Routes>
          <Route path="/" element={
            <>
              {/* Dashboard Overview Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <DashboardCard title="Total Sales" amount={`₹${totalOrdersAmount}/-`} />
                <DashboardCard title="Total Orders" amount={totalOrdersCount.toString()} />
                <DashboardCard title="Total Profit" amount={`₹${totalProfit?.toFixed(2)}/-`} />
                <DashboardCard title="Total Agents" amount={totalAgentCount.toString()} />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Monthly Sales</h2>
                  <div className="h-[400px]">
                    <Bar data={barChartData} options={barOptions} />
                  </div>
                </div>

                <div className="col-span-1 bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Profit Distribution</h2>
                  <div className="h-[300px]">
                    <Pie data={pieChartData} options={pieOptions} />
                  </div>
                </div>
              </div>
            </>
          } />
          <Route path="users" element={<UserList />} />
          <Route path="agents" element={<AgentList />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="customexp" element={<CustomerExperience onClose={() => {}} />} />
          <Route path="sales" element={<SalesListing />} />
        </Routes>
      </div>
    </div>
  );
};

const DashboardCard: React.FC<{ title: string; amount: string }> = ({ title, amount }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <div className="flex items-center space-x-4">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
        <span className="text-blue-600 text-xl">₹</span>
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold">{amount}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;
