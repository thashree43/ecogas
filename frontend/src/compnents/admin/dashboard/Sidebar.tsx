import React from "react";
import { FaBell, FaSignOutAlt, FaHome, FaShoppingCart } from "react-icons/fa";
import { FaUserNinja } from "react-icons/fa6";
import { MdOutlineSupportAgent } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {useLogoutMutation} from "../../../store/slice/Adminslice"

const Sidebar: React.FC = () => {
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout().unwrap(); 

      localStorage.clear();
      sessionStorage.clear();

      toast.success("Logout successful");
      navigate("/admin/login"); 
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };


  return (
    <div style={sidebarStyle}>
      <div style={logoStyle}>
        <img
          src="/photo_2024-08-05_19-22-46.jpg"
          alt="Ferrari Logo"
          style={logoImgStyle}
        />
        <h2>Admin</h2>
      </div>
      <ul style={menuStyle}>
        <li style={menuItemStyle} onClick={() => navigate("/admin/dashboard")}>
          <FaHome /> Dashboard
        </li>
        <li
          style={{ ...menuItemStyle, backgroundColor: "#f8d7da" }}
          onClick={() => navigate("/admin/dashboard/users")}
        >
          <FaUserNinja /> Users
        </li>
        <li
          style={{ ...menuItemStyle, backgroundColor: "#f8d7da" }}
          onClick={() => navigate("/admin/dashboard/agents")}
        >
          <MdOutlineSupportAgent /> Brokers
        </li>
        <li
          style={{ ...menuItemStyle, backgroundColor: "#f8d7da" }}
          onClick={() => navigate("/admin/dashboard/orders")}
        >
          <FaShoppingCart /> Orders
        </li>
       
        <li
          style={{...menuItemStyle,backgroundColor: "#f8d7da" }}
          onClick={() => navigate("/admin/dashboard/customexp")}
        >
          <FaBell /> Customes
        </li>
        <li style={menuItemStyle} onClick={handleLogout}>
          <FaSignOutAlt /> Log-out
        </li>
      </ul>
    </div>
  );
};

const sidebarStyle: React.CSSProperties = {
  width: "200px",
  height: "100vh",
  backgroundColor: "#f4f4f4",
  padding: "20px",
  boxSizing: "border-box",
};

const logoStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  marginBottom: "20px",
};

const logoImgStyle: React.CSSProperties = {
  width: "40px",
  marginRight: "10px",
};

const menuStyle: React.CSSProperties = {
  listStyleType: "none",
  padding: "0",
};

const menuItemStyle: React.CSSProperties = {
  marginBottom: "10px",
  cursor: "pointer",
  padding: "10px",
  display: "flex",
  alignItems: "center",
};

export default Sidebar;
