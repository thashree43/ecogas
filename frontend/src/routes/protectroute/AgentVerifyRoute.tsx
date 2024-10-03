import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../token/gettoken";

interface ProtectedRouteProps {
    component: React.ComponentType;
  }
  
  const AgentVerifyRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
    const navigate = useNavigate();
    const tokens =getToken("agenttoken")
    console.log("agent token in the adminagentverifyrouet ",tokens);
    
    const token = localStorage.getItem("agentToken");
        console.log("The agent token is:", token);
  
    useEffect(() => {
      if (token) {
        navigate("/agent/dashboard");
      }
    }, [token, navigate]);
  
    if (token) {
      return null; 
    }
  
    return <Component />; 
  };
  
  export default AgentVerifyRoute;