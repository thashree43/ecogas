import { useNavigate } from "react-router-dom";
import { getToken } from "../../token/gettoken";
import { useEffect } from "react";

interface ProtectedRouteProps {
  component: React.ComponentType;
}

const UserVerifyroute: React.FC<ProtectedRouteProps> = ({
  component: Component,
}) => {
  const navigate = useNavigate();
  const token = getToken("usertoken");

  useEffect(() => {
    if (token) {
      navigate("/home");
    }
  }, [token, navigate]);

  if (token) {
    return null;
  }

  return <Component />;
};

export default UserVerifyroute;
