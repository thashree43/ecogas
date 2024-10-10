import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../token/gettoken";

interface ProtectedRouteProps {
    component: React.ComponentType;
}

const AgentProtectRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = () => {
            const tokens = getToken("agentToken")
            
            const token = localStorage.getItem("agentToken");

            if (!token) {
                setIsAuthenticated(false);
                navigate("/agent/login");
            } else {
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