import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';
import type { User } from '@app-types/index';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: Array<User['role']>;
}

export default function ProtectedRoute({
  children,
  requiredRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, isInitialized, user } = useAuthStore();

  // Wait until localStorage has been read before making auth decisions.
  // With synchronous init this is almost never a full frame, but it prevents
  // the brief redirect-to-login flash on hard reload.
  if (!isInitialized) {
    return null; // or a <Spinner /> if you prefer
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
