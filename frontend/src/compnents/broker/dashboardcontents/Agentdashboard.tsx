import React, { useState, useEffect } from "react";
import {
  Clock,
  Calendar,
  Activity,
  Phone,
  FileText,
  Car,
  Building,
  LogOut,
} from "lucide-react";
import ProductList from "../Productlistingpage";
import OrderList from "../Orderlistingagent";
import SaleList from "../Saleslist";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ComponentProps } from "../../../interfacetypes/type";
import {
  useAgentlogoutMutation,
  useDashboarddatasQuery,
} from "../../../store/slice/Brokerslice";
import DashboardContent from "../Dashboardcontent";
import Logo from "../../../layouts/Logocomponent"
interface DashboardProps {
  children?: React.ReactNode;
  className?: string;
}

const Card: React.FC<DashboardProps> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow ${className}`}>{children}</div>
);

const CardHeader: React.FC<DashboardProps> = ({ children }) => (
  <div className="p-4 border-b">{children}</div>
);

const CardTitle: React.FC<DashboardProps> = ({ children }) => (
  <h2 className="text-xl font-semibold">{children}</h2>
);

const CardContent: React.FC<DashboardProps> = ({
  children,
  className = "",
}) => <div className={`p-4 ${className}`}>{children}</div>;

const Avatar: React.FC<{ name: string }> = ({ name }) => {
  const getInitials = (name: string) => {
    const splitName = name.split(" ");
    const initials = splitName.map((part) => part[0].toUpperCase()).join("");
    return initials;
  };

  return (
    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
      {getInitials(name)}
    </div>
  );
};

const Agentdashboard = () => {
  const [activeSection, setActiveSection ] = useState<string>("dashboard");
  const [logout] = useAgentlogoutMutation();
  const { data: dashboardData, isLoading, error,refetch } = useDashboarddatasQuery();
  const navigate = useNavigate();

  const agent = localStorage.getItem("agentInfo");
  let agentName = "";
  let agentImage = "";

  if (agent) {
    try {
      const agentObj = JSON.parse(agent);
      agentName = agentObj.agentname;
      agentImage = agentObj.image;
    } catch (error) {
      console.error("Failed to parse agent info from localStorage:", error);
    }
  }

  const handleLogout = async () => {
    await logout().unwrap();
    localStorage.clear();
    sessionStorage.clear();
    toast.success("Logged out successfully");
    navigate("/agent/login");
  };

  useEffect(() => {
    const storedSection = localStorage.getItem("activeSection");
    if (storedSection) {
      setActiveSection(storedSection);
    }
  }, []);

  const handleSidebarClick = (section: string) => {
    if (section === "dashboard") {
      refetch(); // Refetch data when navigating to dashboard
    }
    setActiveSection(section);
    localStorage.setItem("activeSection", section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "company":
        return <ProductList />;
      case "orders":
        return <OrderList />;
      case "sales":
        return <SaleList />;
      case "dashboard":
        if (isLoading) {
          return <div>Loading dashboard data...</div>;
        }

        if (error) {
          return <div>Error loading dashboard data</div>;
        }
        return (
          
          <DashboardContent dashboardData={dashboardData || { orders: [] }} />
        );

      default:
        return (
          <div className="p-4">
            <h2 className="text-xl font-semibold">
              Content for {activeSection}
            </h2>
            <p>This section is under development</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          {/* Logo at the top of sidebar */}
          <Logo />
          
          {/* Avatar and agent's name */}
          <div className="mb-8">
            <Avatar name={agentName} />
            <div className="text-center text-gray-500">{agentName}</div>
          </div>

          <nav className="space-y-2">
            <SidebarItem
              icon={Activity}
              text="Dashboard"
              active={activeSection === "dashboard"}
              onClick={() => handleSidebarClick("dashboard")}
            />
            <SidebarItem
              icon={Building}
              text="Company"
              active={activeSection === "company"}
              onClick={() => handleSidebarClick("company")}
            />
            <SidebarItem
              icon={Car}
              text="Orders"
              active={activeSection === "orders"}
              onClick={() => handleSidebarClick("orders")}
            />
            {/* <SidebarItem
              icon={Phone}
              text="Support Tickets"
              active={activeSection === "support"}
              onClick={() => handleSidebarClick("support")}
            /> */}
            <SidebarItem
              icon={FileText}
              text="Sales Report"
              active={activeSection === "sales"}
              onClick={() => handleSidebarClick("sales")}
            />
            <SidebarItem
              icon={LogOut}
              text="Logout"
              active={activeSection === "logout"}
              onClick={() => handleLogout()}
            />
          </nav>
        </div>
      </div>

      <div className="flex-1 p-8">{renderContent()}</div>
    </div>
  );
};

const SidebarItem: React.FC<ComponentProps> = ({
  icon: Icon,
  text,
  active,
  onClick,
}) => (
  <div
    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer
      ${active ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
    onClick={onClick}
  >
    <Icon size={20} />
    <span>{text}</span>
  </div>
);

const StatsCard: React.FC<ComponentProps> = ({ title, value, icon: Icon }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon size={24} className="text-blue-600" />
        </div>
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-2xl font-semibold">{value}</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default Agentdashboard;
