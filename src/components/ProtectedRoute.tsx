import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import Spinner from './Spinner';
import { APP_ROUTES } from '@/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Spinner fullPage={true} />;
  }

  if (!currentUser) {
    return <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    // Redirect to a generic 'access denied' page or dashboard if role doesn't match
    // For simplicity, redirecting to dashboard. A dedicated "Unauthorized" page would be better.
    return <Navigate to={APP_ROUTES.DASHBOARD} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
