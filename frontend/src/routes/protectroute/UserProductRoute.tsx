    import { useNavigate } from "react-router-dom";
    import { getToken } from "../../token/gettoken";
    import { useEffect, useState } from "react";

    interface ProtectedRouteProps {
        component: React.ComponentType;
    }

    const UserProductRoute: React.FC<ProtectedRouteProps> = ({
        component: Component,
    }) => {
        const navigate = useNavigate();
        const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
        
        useEffect(() => {
            const token = getToken("userToken" );
            console.log("Token in protected route:", token);
            
            if (!token) {
                console.log("No valid token found, redirecting to login");
                navigate("/");
                return;
            }
            
            setIsAuthenticated(true);
        }, [navigate]);
        
        return isAuthenticated ? <Component /> : null;
    };

    export default UserProductRoute;
