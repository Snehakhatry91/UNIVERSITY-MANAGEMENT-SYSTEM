// User Roles and Permissions
export type UserRole = 'STUDENT' | 'FACULTY' | 'ADMINISTRATOR' | 'WORKLOAD';

export interface User {
  id: string;
  username: string; // e.g. '2023cse042'
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  department: string;
  isMfaEnabled: boolean;
  mfaMethod?: 'TOTP' | 'SMS' | 'FIDO2';
  accountStatus: 'ACTIVE' | 'LOCKED' | 'SUSPENDED';
  lastLogin?: string;
}

export interface Permission {
  id: string;
  module: string;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'EXECUTE';
  description: string;
}

export interface AuthSession {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: number;
  federatedFrom: 'CVGU_CAMPUS_IDP';
  mfaVerified: boolean;
  ssoSessionId: string;
  accessibleServices: ('SMS' | 'LMS' | 'ERP' | 'LIBRARY')[];
}

export interface RbacEvaluationResult {
  allowed: boolean;
  reason: string;
  requiredPermission?: string;
  userRole: UserRole;
  timestamp: string;
}
