import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace(`/login?returnUrl=${encodeURIComponent(router.asPath)}`);
      } else if (requiredRole && (!user || user.role !== requiredRole)) {
        router.replace('/unauthorized');
      }
    }
  }, [isAuthenticated, loading, requiredRole, router, user]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!isAuthenticated || (requiredRole && (!user || user.role !== requiredRole))) {
    return null;
  }

  return <>{children}</>;
}; 