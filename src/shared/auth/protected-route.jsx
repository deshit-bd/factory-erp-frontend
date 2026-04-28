import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "@/shared/auth/auth-context";

export function ProtectedRoute() {
  const { authReady, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!authReady) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return <Outlet />;
}
