import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { User, UserRole, AuthSession } from '../types/auth';
import { INITIAL_USERS } from '../data/seedData';
import { evaluateRbacPolicy } from '../api/middleware';
import { ROLE_PERMISSION_MAPPINGS } from '../data/rbacData';

const SESSION_STORAGE_KEY = 'cvgu_auth_session_v1';
const SESSION_DURATION_MS = 4 * 60 * 60 * 1000; // 4 Hours Educational Session

export interface StoredSessionPayload {
  version: '1.0';
  user: User;
  session: AuthSession;
  expiresAt: number;
  savedAt: number;
}

interface AuthContextType {
  currentUser: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isMfaPending: boolean;
  pendingUser: User | null;
  loginError: string | null;
  permittedActions: string[];
  isSessionRestored: boolean;
  hasPermission: (permissionId: string) => boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  login: (username: string, passwordAttempt: string) => Promise<boolean>;
  verifyMfa: (code: string) => boolean;
  cancelMfa: () => void;
  logout: () => void;
  switchDemoUser: (role: UserRole) => void;
  evaluatePermission: (permissionId: string, resourceOwnerId?: string) => { allowed: boolean; reason: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Safe session loader with versioning, expiry validation, and schema guards
const loadPersistedSession = (): { user: User | null; session: AuthSession | null } => {
  try {
    // Check sessionStorage first, then fallback to localStorage
    const rawData = sessionStorage.getItem(SESSION_STORAGE_KEY) || localStorage.getItem(SESSION_STORAGE_KEY);
    if (!rawData) {
      return { user: null, session: null };
    }

    const payload: StoredSessionPayload = JSON.parse(rawData);

    // Version validation
    if (payload.version !== '1.0') {
      console.warn('[CVGU Auth] Session version mismatch. Resetting demo session.');
      clearPersistedSession();
      return { user: null, session: null };
    }

    // Expiry validation
    if (typeof payload.expiresAt === 'number' && Date.now() > payload.expiresAt) {
      console.warn('[CVGU Auth] Demo session has expired. Redirecting to login.');
      clearPersistedSession();
      return { user: null, session: null };
    }

    // Integrity validation: verify user structure and allowed roles
    const validRoles: UserRole[] = ['STUDENT', 'FACULTY', 'ADMINISTRATOR', 'WORKLOAD'];
    if (
      !payload.user ||
      !payload.user.id ||
      !payload.user.username ||
      !payload.user.fullName ||
      !validRoles.includes(payload.user.role)
    ) {
      console.warn('[CVGU Auth] Corrupted session structure detected. Clearing.');
      clearPersistedSession();
      return { user: null, session: null };
    }

    return { user: payload.user, session: payload.session };
  } catch (err) {
    console.error('[CVGU Auth] Failed to parse stored session:', err);
    clearPersistedSession();
    return { user: null, session: null };
  }
};

const clearPersistedSession = () => {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (err) {
    console.error('[CVGU Auth] Error clearing stored session:', err);
  }
};

const savePersistedSession = (user: User, session: AuthSession) => {
  try {
    const payload: StoredSessionPayload = {
      version: '1.0',
      user,
      session,
      expiresAt: session.expiresAt,
      savedAt: Date.now()
    };
    const serialized = JSON.stringify(payload);
    // Write to both sessionStorage (per-tab isolation support) and localStorage (cross-tab sync)
    sessionStorage.setItem(SESSION_STORAGE_KEY, serialized);
    localStorage.setItem(SESSION_STORAGE_KEY, serialized);
  } catch (err) {
    console.error('[CVGU Auth] Failed to persist session:', err);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronous initialization: reads from storage before initial paint, eliminating flash of wrong role
  const initialData = loadPersistedSession();
  const [currentUser, setCurrentUser] = useState<User | null>(initialData.user);
  const [session, setSession] = useState<AuthSession | null>(initialData.session);
  const [isMfaPending, setIsMfaPending] = useState<boolean>(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSessionRestored] = useState<boolean>(true);

  // Sync session across browser tabs if localStorage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SESSION_STORAGE_KEY) {
        if (!e.newValue) {
          // Logged out in another tab
          setCurrentUser(null);
          setSession(null);
          setIsMfaPending(false);
          setPendingUser(null);
        } else {
          try {
            const payload: StoredSessionPayload = JSON.parse(e.newValue);
            if (payload?.user && payload?.session) {
              setCurrentUser(payload.user);
              setSession(payload.session);
            }
          } catch {
            // Ignore parse errors from concurrent storage events
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Periodic session expiration sweep
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      if (session && Date.now() > session.expiresAt) {
        console.warn('[CVGU Auth] Session expired during activity sweep. Logging out.');
        logout();
      }
    }, 60000); // Check every 60 seconds

    return () => clearInterval(interval);
  }, [session]);

  const finishLogin = useCallback((user: User, mfaSuccess: boolean) => {
    const newSession: AuthSession = {
      user,
      token: `cvgu-jwt-${Date.now()}-${user.role.toLowerCase()}`,
      refreshToken: `cvgu-refresh-${Date.now()}`,
      expiresAt: Date.now() + SESSION_DURATION_MS,
      federatedFrom: 'CVGU_CAMPUS_IDP',
      mfaVerified: mfaSuccess,
      ssoSessionId: `sso-cvgu-${Date.now()}`,
      accessibleServices: user.role === 'ADMINISTRATOR' 
        ? ['SMS', 'LMS', 'ERP', 'LIBRARY'] 
        : ['SMS', 'LMS', 'LIBRARY']
    };

    setCurrentUser(user);
    setSession(newSession);
    setLoginError(null);
    setIsMfaPending(false);
    setPendingUser(null);
    savePersistedSession(user, newSession);
  }, []);

  const login = async (username: string, _passwordAttempt: string): Promise<boolean> => {
    setLoginError(null);

    // Look up identity in authoritative directory (Campus IdP Active Directory)
    const matchedUser = INITIAL_USERS.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (!matchedUser) {
      setLoginError('Authentication Failed: Identity not recognized in CVGU Directory.');
      return false;
    }

    if (matchedUser.accountStatus !== 'ACTIVE') {
      setLoginError(`Authentication Failed: Account is ${matchedUser.accountStatus}.`);
      return false;
    }

    // Check if MFA is required (Mandatory for Admins and Faculty)
    if (matchedUser.isMfaEnabled || matchedUser.role === 'ADMINISTRATOR' || matchedUser.role === 'FACULTY') {
      setPendingUser(matchedUser);
      setIsMfaPending(true);
      return true; // proceed to MFA challenge step
    }

    // Successful student login without secondary factor
    finishLogin(matchedUser, false);
    return true;
  };

  const verifyMfa = (code: string): boolean => {
    if (code.trim().length !== 6 || code === '000000') {
      setLoginError('Invalid TOTP Verification Code. Simulated Challenge Failed.');
      return false;
    }

    if (pendingUser) {
      finishLogin(pendingUser, true);
      return true;
    }
    return false;
  };

  const cancelMfa = () => {
    setIsMfaPending(false);
    setPendingUser(null);
    setLoginError(null);
  };

  const logout = useCallback(() => {
    setCurrentUser(null);
    setSession(null);
    setIsMfaPending(false);
    setPendingUser(null);
    setLoginError(null);
    clearPersistedSession();
  }, []);

  const switchDemoUser = useCallback((role: UserRole) => {
    const demoUser = INITIAL_USERS.find(u => u.role === role);
    if (demoUser) {
      finishLogin(demoUser, demoUser.isMfaEnabled || role === 'ADMINISTRATOR');
    }
  }, [finishLogin]);

  const evaluatePermission = useCallback((permissionId: string, resourceOwnerId?: string) => {
    if (!currentUser) {
      return { allowed: false, reason: 'Unauthenticated request: No active session.' };
    }
    const result = evaluateRbacPolicy(
      currentUser.role,
      currentUser.username,
      permissionId,
      resourceOwnerId,
      currentUser.id
    );
    return { allowed: result.allowed, reason: result.reason };
  }, [currentUser]);

  // Derived permitted actions list from centralized RBAC policy
  const permittedActions = useMemo(() => {
    if (!currentUser) return [];
    return ROLE_PERMISSION_MAPPINGS[currentUser.role] || [];
  }, [currentUser]);

  const hasPermission = useCallback((permissionId: string): boolean => {
    if (!currentUser) return false;
    return (ROLE_PERMISSION_MAPPINGS[currentUser.role] || []).includes(permissionId);
  }, [currentUser]);

  const hasRole = useCallback((roles: UserRole | UserRole[]): boolean => {
    if (!currentUser) return false;
    if (Array.isArray(roles)) {
      return roles.includes(currentUser.role);
    }
    return currentUser.role === roles;
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        session,
        isAuthenticated: !!currentUser,
        isMfaPending,
        pendingUser,
        loginError,
        permittedActions,
        isSessionRestored,
        hasPermission,
        hasRole,
        login,
        verifyMfa,
        cancelMfa,
        logout,
        switchDemoUser,
        evaluatePermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
