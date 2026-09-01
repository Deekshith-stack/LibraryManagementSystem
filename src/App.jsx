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
  const [currentTab, setCurrentTab] = useState('');
  const [searchVal, setSearchVal] = useState('');

  // Render content based on current selected tab
  const renderTabContent = () => {
    switch (currentTab) {
      // Student Portal
      case 'student-dashboard':
        return <StudentDashboard searchVal={searchVal} />;
      case 'student-catalog':
        return <StudentCatalog searchVal={searchVal} />;
      case 'student-fines':
        return <StudentFines />;

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
            <h3 className="empty-state-title">Loading LMS Interface...</h3>
            <p className="empty-state-desc">Initializing session state.</p>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <div className="main-content">
        <Navbar searchVal={searchVal} setSearchVal={setSearchVal} />
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
