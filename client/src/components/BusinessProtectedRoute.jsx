import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BusinessProtectedRoute = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role != "business") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default BusinessProtectedRoute;
