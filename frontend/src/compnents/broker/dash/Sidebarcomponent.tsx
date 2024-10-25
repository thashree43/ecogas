import React, { useState } from "react";
import { FaHome, FaUsers, FaUserTie, FaSignOutAlt, FaBuilding } from "react-icons/fa";
import { RiShoppingBasketFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("dashboard");

  const agent = localStorage.getItem("agentInfo");
  let agentName = "";
  let agentImage = "";

  if (agent) {
    try {
      const agentObj = JSON.parse(agent); // Parse the JSON string into an object
      agentName = agentObj.agentname; // Access the agentname property
      agentImage = agentObj.image; // Access the image property
    } catch (error) {
      console.error("Failed to parse agent info from localStorage:", error);
    }
  }
  console.log("the image fro the agent be this and  the image isthis ",agentImage,);
  

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.success("Logged out successfully");
    navigate("/agent/login");
  };

  const menuItems = [
    { id: "dashboard", icon: FaHome, label: "Dashboard", path: "/agent/dashboard" },
    { id: "users", icon: FaUsers, label: "Users", path: "/agent/dashboard/users" },
    { id: "company", icon: FaBuilding, label: "Company", path: "/agent/dashboard/company" },
    { id: "orders", icon: RiShoppingBasketFill, label: "Orders", path: "/agent/dashboard/orders" },
    { id: "sales", icon: RiShoppingBasketFill, label: "Sales", path: "/agent/dashboard/sales" },
  ];

  return (
    <div style={sidebarStyle}>
      <div style={logoStyle}>
        {/* Display agent image if available, otherwise show a placeholder */}
        <img
          src={agentImage || "../../../../public/default-avatar.jpg"} // Fallback to a default image
          alt="Agent Avatar"
          style={logoImgStyle}
        />
        <h2 style={adminNameStyle}>{agentName}</h2>
      </div>
      <nav style={navStyle}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            style={{
              ...menuItemStyle,
              ...(activeItem === item.id ? activeItemStyle : {}),
            }}
            onClick={() => {
              setActiveItem(item.id);
              navigate(item.path);
            }}
          >
            <item.icon style={iconStyle} />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
      <div style={logoutButtonStyle} onClick={handleLogout}>
        <FaSignOutAlt style={iconStyle} />
        <span>Logout</span>
      </div>
    </div>
  );
};

const sidebarStyle: React.CSSProperties = {
  width: "280px",
  height: "100vh",
  background: "linear-gradient(180deg, #2c3e50 0%, #34495e 100%)",
  padding: "20px",
  boxSizing: "border-box",
  color: "#ecf0f1",
  display: "flex",
  flexDirection: "column",
};

const logoStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: "40px",
};

const logoImgStyle: React.CSSProperties = {
  width: "80px",
  height: "80px",
  borderRadius: "50%", // Make the image circular
  marginBottom: "15px",
  objectFit: "cover", // Ensure the image doesn't stretch
};

const adminNameStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "1.2rem",
  fontWeight: "bold",
  textAlign: "center",
};

const navStyle: React.CSSProperties = {
  flex: 1,
};

const menuItemStyle: React.CSSProperties = {
  padding: "12px 20px",
  marginBottom: "10px",
  display: "flex",
  alignItems: "center",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const activeItemStyle: React.CSSProperties = {
  backgroundColor: "rgba(236, 240, 241, 0.1)",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const iconStyle: React.CSSProperties = {
  marginRight: "15px",
  fontSize: "1.2rem",
};

const logoutButtonStyle: React.CSSProperties = {
  ...menuItemStyle,
  backgroundColor: "rgba(231, 76, 60, 0.1)",
  color: "#e74c3c",
};

export default Sidebar;
