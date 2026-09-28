import React, { useState } from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate, 
  useNavigate, 
  useLocation, 
  Outlet 
} from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UniversityDataProvider } from './context/UniversityDataContext';

import { Navbar } from './components/common/Navbar';
import { Sidebar, NavItem } from './components/common/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { ArchitectureCanvas } from './components/canvas/ArchitectureCanvas';
import { NetworkArchitectureView } from './components/network/NetworkArchitectureView';
import { IdentityAccessView } from './components/identity/IdentityAccessView';
import { SecurityView } from './components/security/SecurityView';
import { HybridConnectivityView } from './components/hybrid/HybridConnectivityView';
import { MonitoringView } from './components/monitoring/MonitoringView';
import { CadArchitectureView } from './components/cad/CadArchitectureView';
import { CloudMappingView } from './components/mapping/CloudMappingView';
import { DocumentationView } from './components/docs/DocumentationView';
import { ValidationView } from './components/validation/ValidationView';
import { ValidationDrawer } from './components/canvas/ValidationDrawer';
import { 
  HelpSupportModal, 
  UserProfileModal, 
  SettingsModal 
} from './components/common/Modals';

// Portal Views
import { LoginView } from './portal/auth/LoginView';
import { StudentWorkspace } from './portal/student/StudentWorkspace';
import { FacultyWorkspace } from './portal/faculty/FacultyWorkspace';
import { AdminWorkspace } from './portal/admin/AdminWorkspace';

// Auth Guards & Modals
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RequireRole } from './components/auth/RequireRole';
import { AccessDeniedView } from './components/auth/AccessDeniedView';
import { RolePermissionMatrixModal } from './components/auth/RolePermissionMatrixModal';

/**
 * Intelligent Root Redirector:
 * - Unauthenticated -> /login
 * - Student -> /portal/student
 * - Faculty -> /portal/faculty
 * - Administrator -> /dashboard
 */
const RootRedirect: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role === 'STUDENT') {
    return <Navigate to="/portal/student" replace />;
  }

  if (currentUser.role === 'FACULTY') {
    return <Navigate to="/portal/faculty" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

/**
 * Architecture Dashboard View Wrapper with Route Navigation Callbacks
 */
const DashboardTabRoute: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleOpenPortal = () => {
    if (currentUser?.role === 'STUDENT') {
      navigate('/portal/student');
    } else if (currentUser?.role === 'FACULTY') {
      navigate('/portal/faculty');
    } else {
      navigate('/portal/admin');
    }
  };

  return (
    <DashboardView 
      onNavigate={(tab) => navigate(`/${tab}`)} 
      onOpenRequestSim={() => navigate('/overview')}
      onOpenPortal={handleOpenPortal}
    />
  );
};

/**
 * Shared Architecture Layout:
 * Preserves exact layout, Navbar, Sidebar, and system modals.
 * Synchronizes active tab directly with React Router URL path.
 */
const ArchitectureLayout: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isValidationDrawerOpen, setIsValidationDrawerOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);

  // Derive active tab from current URL segment
  const pathSegment = location.pathname.replace(/^\//, '').split('/')[0] as NavItem;
  const validTabs: NavItem[] = [
    'dashboard', 'overview', 'network', 'identity', 'security', 
    'hybrid', 'monitoring', 'cad', 'mapping', 'docs', 'validation'
  ];
  const activeTab: NavItem = validTabs.includes(pathSegment) ? pathSegment : 'dashboard';

  const handleOpenRequestSim = () => {
    navigate('/overview');
  };

  const handleOpenCampusPortal = () => {
    if (currentUser?.role === 'STUDENT') {
      navigate('/portal/student');
    } else if (currentUser?.role === 'FACULTY') {
      navigate('/portal/faculty');
    } else {
      navigate('/portal/admin');
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#F5F9FF] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Navbar 
        activeTab={activeTab}
        onOpenValidation={() => navigate('/validation')}
        onOpenRequestSim={handleOpenRequestSim}
        onOpenPortal={handleOpenCampusPortal}
        onOpenProfile={() => setIsProfileOpen(true)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={(tab) => navigate(`/${tab}`)}
          onOpenHelp={() => setIsHelpOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenCampusPortal={handleOpenCampusPortal}
          onOpenMatrix={() => setIsMatrixOpen(true)}
        />
        
        <main className="flex-1 flex overflow-hidden relative">
          <Outlet context={{ setIsMatrixOpen }} />
        </main>
      </div>

      {/* Validation Quick Drawer */}
      <ValidationDrawer
        isOpen={isValidationDrawerOpen}
        onClose={() => setIsValidationDrawerOpen(false)}
      />

      {/* Enterprise Shell Modals */}
      <HelpSupportModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
      />
      <UserProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
      <RolePermissionMatrixModal
        isOpen={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
      />
    </div>
  );
};

/**
 * CadRoute Guard:
 * Only ADMINISTRATOR may access the CAD Architecture Blueprint.
 * Students and Faculty are presented with the HTTP 403 Least-Privilege Access Denied screen.
 */
const CadRoute: React.FC = () => {
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);

  return (
    <>
      <RequireRole allowedRoles={['ADMINISTRATOR']} onOpenMatrix={() => setIsMatrixOpen(true)}>
        <CadArchitectureView />
      </RequireRole>
      <RolePermissionMatrixModal
        isOpen={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
      />
    </>
  );
};

const StudentWorkspaceRoute: React.FC = () => {
  const navigate = useNavigate();
  return <StudentWorkspace onOpenArchitecture={() => navigate('/cad')} />;
};

const FacultyWorkspaceRoute: React.FC = () => {
  const navigate = useNavigate();
  return <FacultyWorkspace onOpenArchitecture={() => navigate('/cad')} />;
};

const AdminWorkspaceRoute: React.FC = () => {
  const navigate = useNavigate();
  return <AdminWorkspace onOpenArchitecture={() => navigate('/cad')} />;
};

/**
 * Main Application Router Setup
 */
export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UniversityDataProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Demo Login */}
              <Route path="/login" element={<LoginView />} />

              {/* Root redirector */}
              <Route path="/" element={<RootRedirect />} />

              {/* Portal Workspace Routes (Protected + Role Guarded) */}
              <Route 
                path="/portal/student" 
                element={
                  <ProtectedRoute>
                    <RequireRole allowedRoles={['STUDENT', 'ADMINISTRATOR']}>
                      <StudentWorkspaceRoute />
                    </RequireRole>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/portal/faculty" 
                element={
                  <ProtectedRoute>
                    <RequireRole allowedRoles={['FACULTY', 'ADMINISTRATOR']}>
                      <FacultyWorkspaceRoute />
                    </RequireRole>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/portal/admin" 
                element={
                  <ProtectedRoute>
                    <RequireRole allowedRoles={['ADMINISTRATOR']}>
                      <AdminWorkspaceRoute />
                    </RequireRole>
                  </ProtectedRoute>
                } 
              />

              {/* Cloud Architecture Management System (Protected) */}
              <Route 
                element={
                  <ProtectedRoute>
                    <ArchitectureLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<DashboardTabRoute />} />
                <Route path="/overview" element={<ArchitectureCanvas />} />
                <Route path="/network" element={<NetworkArchitectureView />} />
                <Route path="/identity" element={<IdentityAccessView />} />
                <Route path="/security" element={<SecurityView />} />
                <Route path="/hybrid" element={<HybridConnectivityView />} />
                <Route path="/monitoring" element={<MonitoringView />} />
                <Route path="/cad" element={<CadRoute />} />
                <Route path="/mapping" element={<CloudMappingView />} />
                <Route path="/docs" element={<DocumentationView />} />
                <Route path="/validation" element={<ValidationView />} />
              </Route>

              {/* 403 Forbidden Fallback */}
              <Route path="/403" element={<AccessDeniedView />} />

              {/* Catch-all route */}
              <Route path="*" element={<RootRedirect />} />
            </Routes>
          </BrowserRouter>
        </UniversityDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
