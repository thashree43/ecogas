import { useNavigate } from "react-router-dom";
import { getToken } from "../../token/gettoken";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
    component: React.ComponentType;
}

const UserVerifyRoute: React.FC<ProtectedRouteProps> = ({
    component: Component,
}) => {
    const navigate = useNavigate();
    const [isPublicRoute, setIsPublicRoute] = useState<boolean>(false);
    
    useEffect(() => {
        const token = getToken("userToken");
        console.log("Token in verify route:", token);
        
        if (token) {
            console.log("Valid token found, redirecting to home");
            navigate("/home");
            return;
        }
        
        setIsPublicRoute(true);
    }, [navigate]);
    
    return isPublicRoute ? <Component /> : null;
};

export default UserVerifyRoute;