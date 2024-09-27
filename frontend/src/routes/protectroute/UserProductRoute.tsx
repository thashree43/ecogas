import { useNavigate } from "react-router-dom";
import { getToken } from "../../Token/gettoken";
import { useEffect } from "react";

interface ProtectedRouteProps {
  component: React.ComponentType;
}

const UserProductroute: React.FC<ProtectedRouteProps> = ({
  component: Component,
}) => {
  const navigate = useNavigate();
  const token = getToken("usertoken");
console.log("the token be the this which have been provided from the userside ",token);

  useEffect(() => {
    if (!token) {
      navigate("/home");
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  return <Component />;
};

export default UserProductroute;
