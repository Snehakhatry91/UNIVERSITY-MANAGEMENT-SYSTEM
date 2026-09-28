import { UserRole, RbacEvaluationResult } from '../types/auth';
import { ROLE_PERMISSION_MAPPINGS } from '../data/rbacData';

export interface AuditEventLogger {
  logSecurityEvent: (action: string, principal: string, role: string, status: 'ALLOW' | 'DENY', reason: string) => void;
}

let externalLogger: AuditEventLogger | null = null;

export const registerAuditLogger = (logger: AuditEventLogger) => {
  externalLogger = logger;
};

/**
 * Backend API Authorization Engine
 * Strictly enforces Role-Based Access Control (RBAC) and Least Privilege.
 */
export const evaluateRbacPolicy = (
  userRole: UserRole,
  principalUsername: string,
  requiredPermission: string,
  resourceOwnerId?: string,
  currentUserId?: string
): RbacEvaluationResult => {
  const timestamp = new Date().toISOString();

  // Rule 1: Direct Database Queries are DENIED to all human users (Zero Trust / Private DB)
  if (requiredPermission === 'db:direct_query') {
    const result: RbacEvaluationResult = {
      allowed: false,
      reason: 'SECURITY POLICY DENIAL: Direct client database queries over Port 5432 are strictly prohibited. Access is restricted to authorized backend application servers.',
      requiredPermission,
      userRole,
      timestamp
    };
    externalLogger?.logSecurityEvent('DIRECT_DATABASE_ACCESS_ATTEMPT', principalUsername, userRole, 'DENY', result.reason);
    return result;
  }

  // Rule 2: Check Role-Permission Mapping
  const rolePermissions = ROLE_PERMISSION_MAPPINGS[userRole] || [];
  const hasPermission = rolePermissions.includes(requiredPermission);

  if (!hasPermission) {
    const result: RbacEvaluationResult = {
      allowed: false,
      reason: `RBAC AUTHORIZATION VIOLATION: Role [${userRole}] lacks the required entitlement [${requiredPermission}].`,
      requiredPermission,
      userRole,
      timestamp
    };
    externalLogger?.logSecurityEvent(`UNAUTHORIZED_ACCESS_ATTEMPT [${requiredPermission}]`, principalUsername, userRole, 'DENY', result.reason);
    return result;
  }

  // Rule 3: Resource Ownership / Multi-Tenancy Scope Check
  // E.g. A student can only view their own attendance or submit their own assignments
  if (userRole === 'STUDENT' && resourceOwnerId && currentUserId && resourceOwnerId !== currentUserId) {
    const result: RbacEvaluationResult = {
      allowed: false,
      reason: `SCOPE BOUNDARY VIOLATION: Student [${principalUsername}] cannot access private record owned by [${resourceOwnerId}].`,
      requiredPermission,
      userRole,
      timestamp
    };
    externalLogger?.logSecurityEvent('RESOURCE_ISOLATION_VIOLATION', principalUsername, userRole, 'DENY', result.reason);
    return result;
  }

  // Allowed
  const result: RbacEvaluationResult = {
    allowed: true,
    reason: `RBAC POLICY GRANTED: Principal [${principalUsername}] possesses role [${userRole}] with verified permission [${requiredPermission}].`,
    requiredPermission,
    userRole,
    timestamp
  };
  externalLogger?.logSecurityEvent(`API_INVOCATION [${requiredPermission}]`, principalUsername, userRole, 'ALLOW', 'Authorized by policy');
  return result;
};
