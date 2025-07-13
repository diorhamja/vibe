import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role == "business") {
    return <Navigate to="/business" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
