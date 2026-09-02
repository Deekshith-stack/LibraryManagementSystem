import React, { useState, useContext } from 'react';
import { LibraryProvider, LibraryContext } from './context/LibraryContext';
import Sidebar from './components/Shared/Sidebar';
import Navbar from './components/Shared/Navbar';

// Student Portal Components
import StudentDashboard from './components/Student/StudentDashboard';
import StudentCatalog from './components/Student/StudentCatalog';
import StudentFines from './components/Student/StudentFines';

// Librarian Portal Components
import BookCatalog from './components/Librarian/BookCatalog';
import IssueReturn from './components/Librarian/IssueReturn';
import Reservations from './components/Librarian/Reservations';

// Admin Portal Components
import Dashboard from './components/Admin/Dashboard';
import UserManagement from './components/Admin/UserManagement';
import LibrarySettings from './components/Admin/LibrarySettings';

function MainApp() {
  const { currentUser } = useContext(LibraryContext);
  const [currentTab, setCurrentTab] = useState('student-dashboard');
  const [searchVal, setSearchVal] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  // Render content based on current selected tab
  const renderTabContent = () => {
    switch (currentTab) {
      // Student Portal
      case 'student-dashboard':
        return <StudentDashboard searchVal={searchVal} onNavigateTab={setCurrentTab} />;
      case 'student-catalog':
        return <StudentCatalog searchVal={searchVal} onNavigateTab={setCurrentTab} />;
      case 'student-fines':
        return <StudentFines onNavigateTab={setCurrentTab} />;

      // Librarian Portal
      case 'lib-catalog':
        return <BookCatalog searchVal={searchVal} />;
      case 'lib-issue-return':
        return <IssueReturn searchVal={searchVal} />;
      case 'lib-reservations':
        return <Reservations />;

      // Admin Portal
      case 'admin-dashboard':
        return <Dashboard />;
      case 'admin-users':
        return <UserManagement />;
      case 'admin-settings':
        return <LibrarySettings />;

      default:
        return (
          <div className="glass-card empty-state" style={{ margin: '2rem' }}>
            <h3 className="empty-state-title">Loading Library Interface...</h3>
            <p className="empty-state-desc">Initializing session state.</p>
          </div>
        );
    }
  };

  return (
    <div className={`app-container ${isSidebarCollapsed ? 'sidebar-is-collapsed' : ''}`}>
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />
      
      <div className="main-content">
        <Navbar 
          searchVal={searchVal} 
          setSearchVal={setSearchVal}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          onNavigateTab={setCurrentTab}
        />
        <main className="page-container">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LibraryProvider>
      <MainApp />
    </LibraryProvider>
  );
}
