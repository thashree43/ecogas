import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface DashboardData {
  totalSales: number;
  totalProfit: number;
  monthlyData: {
    month: string;
    sales: number;
    profit: number;
  }[];
}

interface DashboardContentProps {
  dashboardData: DashboardData;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ dashboardData }) => {
  const COLORS = ["#0088FE", "#FFBB28", "#FF8042"];

  // Filter months that have sales > 0
  const filteredMonthlyData = dashboardData.monthlyData.filter((data) => data.sales > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Total Sales and Profit Cards */}
      <StatsCard title="Total Sales" value={dashboardData.totalSales} icon={"symbol"} />
      <StatsCard title="Total Profit" value={dashboardData.totalProfit.toFixed()} icon={"symbol"} />

      {/* Monthly Sales Bar Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Monthly Sales</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dashboardData.monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Profit Distribution Pie Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Profit Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={filteredMonthlyData}
              dataKey="profit"
              nameKey="month"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#82ca9d"
              label={({ month, profit }) => `${month}: ₹${profit.toFixed(2)}`}
            >
              {filteredMonthlyData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StatsCard: React.FC<{ title: string; value: any; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-6 rounded-lg shadow flex items-center">
    <div className="p-4 bg-blue-100 rounded-full">
      
      {/* <Icon className="text-blue-500" /> */}
      <span className="text-blue-500 text-2xl">₹</span>

    </div>
    <div className="ml-4">
      <div className="text-gray-600">{title}</div>
      <div className="text-2xl font-bold">₹{value}/-</div>
    </div>
  </div>
);

export default DashboardContent;
