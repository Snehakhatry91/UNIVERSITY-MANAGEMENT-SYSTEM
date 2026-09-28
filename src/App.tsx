import React, { useState } from 'react';
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

const MainAppContent: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [appMode, setAppMode] = useState<'portal' | 'architecture'>('architecture');
  const [activeTab, setActiveTab] = useState<NavItem>('dashboard');
  const [isValidationDrawerOpen, setIsValidationDrawerOpen] = useState(false);
  
  // Enterprise Application Shell Modals
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleOpenRequestSim = () => {
    setAppMode('architecture');
    setActiveTab('overview');
  };

  // Render Portal Mode (Student, Faculty, Admin, or Login)
  if (appMode === 'portal') {
    if (!isAuthenticated || !currentUser) {
      return (
        <LoginView
          onSuccess={() => setAppMode('portal')}
          onOpenArchitecture={() => setAppMode('architecture')}
        />
      );
    }

    if (currentUser.role === 'STUDENT') {
      return <StudentWorkspace onOpenArchitecture={() => setAppMode('architecture')} />;
    }

    if (currentUser.role === 'FACULTY') {
      return <FacultyWorkspace onOpenArchitecture={() => setAppMode('architecture')} />;
    }

    if (currentUser.role === 'ADMINISTRATOR') {
      return <AdminWorkspace onOpenArchitecture={() => setAppMode('architecture')} />;
    }
  }

  // Render Cloud Architecture Management System
  const renderArchitectureTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            onNavigate={(tab) => setActiveTab(tab)} 
            onOpenRequestSim={handleOpenRequestSim}
            onOpenPortal={() => setAppMode('portal')}
          />
        );
      case 'overview':
        return <ArchitectureCanvas />;
      case 'network':
        return <NetworkArchitectureView />;
      case 'identity':
        return <IdentityAccessView />;
      case 'security':
        return <SecurityView />;
      case 'hybrid':
        return <HybridConnectivityView />;
      case 'monitoring':
        return <MonitoringView />;
      case 'cad':
        return <CadArchitectureView />;
      case 'mapping':
        return <CloudMappingView />;
      case 'docs':
        return <DocumentationView />;
      case 'validation':
        return <ValidationView />;
      default:
        return (
          <DashboardView 
            onNavigate={(tab) => setActiveTab(tab)} 
            onOpenRequestSim={handleOpenRequestSim}
            onOpenPortal={() => setAppMode('portal')}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#F5F9FF] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Navbar 
        activeTab={activeTab}
        onOpenValidation={() => setActiveTab('validation')}
        onOpenRequestSim={handleOpenRequestSim}
        onOpenPortal={() => setAppMode('portal')}
        onOpenProfile={() => setIsProfileOpen(true)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          onOpenHelp={() => setIsHelpOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenCampusPortal={() => setAppMode('portal')}
        />
        
        <main className="flex-1 flex overflow-hidden relative">
          {renderArchitectureTab()}
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
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UniversityDataProvider>
          <MainAppContent />
        </UniversityDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
