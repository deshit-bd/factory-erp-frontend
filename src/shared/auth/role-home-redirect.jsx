import { Navigate } from "react-router-dom";

import { useAuth } from "@/shared/auth/auth-context";
import { getPostLoginPath } from "@/shared/config/auth-routing";

export function RoleHomeRedirect() {
  const { authReady, isAuthenticated, user } = useAuth();

  if (!authReady) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  return <Navigate replace to={getPostLoginPath(user, "/")} />;
}
