import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';
import type { User } from '@app-types/index';

interface ProtectedRouteProps {
  requiredRoles?: Array<User['role']>;
}

export const useProtectedRoute = ({ requiredRoles }: ProtectedRouteProps = {}) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    setIsChecking(true);

    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      setIsChecking(false);
      return;
    }

    if (requiredRoles && user && !requiredRoles.includes(user.role)) {
      navigate('/unauthorized', { replace: true });
      setIsChecking(false);
      return;
    }

    setIsAuthorized(true);
    setIsChecking(false);
  }, [isAuthenticated, user, requiredRoles, navigate]);

  return { isAuthorized, isChecking };
};
