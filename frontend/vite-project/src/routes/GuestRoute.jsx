import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/auth-context";

function GuestRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <p className="p-8 text-center text-gray-500">Loading your account...</p>;
  }

  return user ? <Navigate to="/products" replace /> : children;
}

export default GuestRoute;
