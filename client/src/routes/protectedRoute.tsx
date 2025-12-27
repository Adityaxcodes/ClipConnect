import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

type ProtectedRouteProps = {
  children: ReactNode;
  role?: "CREATOR" | "CLIPPER";
};

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // ⏳ Wait until auth check finishes
  if (isLoading) {
    return null; // or a loader/spinner
  }

  // ❌ Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Wrong role
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return <>{children}</>;
};

export default ProtectedRoute;
