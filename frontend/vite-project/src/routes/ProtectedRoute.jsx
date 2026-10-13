import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/auth-context";
import DashboardLayout from "../layouts/DashboardLayout";

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <p className="p-8 text-center text-gray-500">Loading your account...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}

export default ProtectedRoute;
