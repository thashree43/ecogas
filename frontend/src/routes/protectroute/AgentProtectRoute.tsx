import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../Token/gettoken";

interface ProtectedRouteProps {
    component: React.ComponentType;
}

const AgentProtectRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    console.log("AgentProtectRoute rendered");

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("agentToken");
            console.log("AgentProtectRoute - token:", token);

            if (!token) {
                console.log("No token, navigating to login");
                setIsAuthenticated(false);
                navigate("/agent/login");
            } else {
                console.log("Token found, user is authenticated");
                setIsAuthenticated(true);
            }
        };

        checkAuth();
    }, [navigate]);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Component /> : null;
};

export default AgentProtectRoute;