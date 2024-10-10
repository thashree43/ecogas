import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../token/gettoken";

interface ProtectedRouteProps {
    component: React.ComponentType;
}

const AdminProtectRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("adminToken");

            if (!token) {
                setIsAuthenticated(false);
                navigate("/admin/login");
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

export default AdminProtectRoute;