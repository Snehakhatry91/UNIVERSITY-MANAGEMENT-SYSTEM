import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';
import { AccessDeniedView } from './AccessDeniedView';

interface RequireRoleProps {
  allowedRoles: UserRole[];
  children?: React.ReactNode;
  onOpenMatrix?: () => void;
}

/**
 * Reusable role-based access guard.
 * Validates that the current user session role matches one of the authorized roles.
 * If unauthorized, prevents rendering privileged child components and displays
 * a polished HTTP 403 Access Denied view.
 */
export const RequireRole: React.FC<RequireRoleProps> = ({
  allowedRoles,
  children,
  onOpenMatrix
}) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return (
      <AccessDeniedView
        attemptedPath={location.pathname}
        requiredRoles={allowedRoles}
        onOpenMatrix={onOpenMatrix}
      />
    );
  }

  return <>{children}</>;
};
