import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GuestRoute = () => {
  const { user } = useAuth();

  if (user && user.role == "business") {
    return <Navigate to="/business" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
