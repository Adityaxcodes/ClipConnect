import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

type ProtectedRouteProps = {
  children: ReactNode;
  role?: "CREATOR" | "CLIPPER";
};

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { isLoading } = useAuth();

  // ⏳ Wait until auth check finishes
  if (isLoading) {
    return null; // or a loader/spinner
  }

  // Check localStorage directly for token and role
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // ❌ Not logged in - no token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Wrong role - role required but doesn't match
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return <>{children}</>;
};

export default ProtectedRoute;
