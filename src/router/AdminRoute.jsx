import { use } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../auth/AuthContext";


const AdminRoute = ({ children }) => {
  const { user, loading } = use(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div className="mt-10 text-center">Loading...</div>;
  }

  if (user && user.role === "admin") {
    return children;
  }

  return <Navigate to="/unauthorized" state={{ from: location }} replace />;
};

export default AdminRoute;
