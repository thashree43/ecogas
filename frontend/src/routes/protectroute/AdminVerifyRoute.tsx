import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../token/gettoken";

interface ProtectedRouteProps {
  component: React.ComponentType;
}

const AdminVerifyRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");
      console.log("The admin token is:", token);

  useEffect(() => {
    if (token) {
      navigate("/admin/dashboard");
    }
  }, [token, navigate]);

  if (token) {
    return null; 
  }

  return <Component />; 
};

export default AdminVerifyRoute;
