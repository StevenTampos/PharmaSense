import type { ReactElement, ReactNode } from "react";
import { Navigate } from "react-router";
import { getHomePathForRole } from "@/lib/roles";
import { ROUTES } from "@/lib/routes";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/account";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole: UserRole;
}

/**
 * Restricts a route to an authenticated user with the required role.
 *
 * @param props - Route content and required role.
 * @returns Protected content or a redirect.
 */
function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps): ReactElement {
  const { user } = useAuth();

  // The backend will enforce authorization when its API is implemented.
  if (!user) {
    return <Navigate to={ROUTES.login} replace />;
  }

  if (user.role !== requiredRole) {
    return <Navigate to={getHomePathForRole(user.role)} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
