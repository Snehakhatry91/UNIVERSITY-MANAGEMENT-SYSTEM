import React, { createContext, useContext, useState } from 'react';
import { User, UserRole, AuthSession } from '../types/auth';
import { INITIAL_USERS } from '../data/seedData';
import { evaluateRbacPolicy } from '../api/middleware';

interface AuthContextType {
  currentUser: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isMfaPending: boolean;
  loginError: string | null;
  login: (username: string, passwordHash: string) => Promise<boolean>;
  verifyMfa: (code: string) => boolean;
  logout: () => void;
  switchDemoUser: (role: UserRole) => void;
  evaluatePermission: (permissionId: string, resourceOwnerId?: string) => { allowed: boolean; reason: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Student Rohan Sharma
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]);
  const [isMfaPending, setIsMfaPending] = useState<boolean>(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [session, setSession] = useState<AuthSession | null>(() => ({
    user: INITIAL_USERS[0],
    token: `cvgu-jwt-${Date.now()}-student`,
    refreshToken: `cvgu-refresh-${Date.now()}`,
    expiresAt: Date.now() + 3600 * 1000,
    federatedFrom: 'CVGU_CAMPUS_IDP',
    mfaVerified: false,
    ssoSessionId: `sso-cvgu-${Date.now()}`,
    accessibleServices: ['SMS', 'LMS', 'LIBRARY']
  }));

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
    if (matchedUser.isMfaEnabled || matchedUser.role === 'ADMINISTRATOR') {
      setPendingUser(matchedUser);
      setIsMfaPending(true);
      return true; // proceed to MFA step
    }

    // Successful student login
    finishLogin(matchedUser, false);
    return true;
  };

  const verifyMfa = (code: string): boolean => {
    if (code.trim().length !== 6 || code === '000000') {
      setLoginError('Invalid TOTP Verification Code. Challenge Failed.');
      return false;
    }

    if (pendingUser) {
      finishLogin(pendingUser, true);
      setIsMfaPending(false);
      setPendingUser(null);
      return true;
    }
    return false;
  };

  const finishLogin = (user: User, mfaSuccess: boolean) => {
    setCurrentUser(user);
    const newSession: AuthSession = {
      user,
      token: `cvgu-jwt-${Date.now()}-${user.role.toLowerCase()}`,
      refreshToken: `cvgu-refresh-${Date.now()}`,
      expiresAt: Date.now() + 3600 * 1000,
      federatedFrom: 'CVGU_CAMPUS_IDP',
      mfaVerified: mfaSuccess,
      ssoSessionId: `sso-cvgu-${Date.now()}`,
      accessibleServices: user.role === 'ADMINISTRATOR' 
        ? ['SMS', 'LMS', 'ERP', 'LIBRARY'] 
        : user.role === 'FACULTY' 
        ? ['SMS', 'LMS', 'LIBRARY'] 
        : ['SMS', 'LMS', 'LIBRARY']
    };
    setSession(newSession);
    setLoginError(null);
  };

  const logout = () => {
    setCurrentUser(null);
    setSession(null);
    setIsMfaPending(false);
    setPendingUser(null);
  };

  const switchDemoUser = (role: UserRole) => {
    const demoUser = INITIAL_USERS.find(u => u.role === role);
    if (demoUser) {
      finishLogin(demoUser, demoUser.isMfaEnabled);
    }
  };

  const evaluatePermission = (permissionId: string, resourceOwnerId?: string) => {
    if (!currentUser) {
      return { allowed: false, reason: 'Unauthenticated request.' };
    }
    const result = evaluateRbacPolicy(
      currentUser.role,
      currentUser.username,
      permissionId,
      resourceOwnerId,
      currentUser.id
    );
    return { allowed: result.allowed, reason: result.reason };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        session,
        isAuthenticated: !!currentUser,
        isMfaPending,
        loginError,
        login,
        verifyMfa,
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
