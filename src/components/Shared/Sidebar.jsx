import React, { useContext } from 'react';
import { LibraryContext } from '../../context/LibraryContext';
import { 
  BookOpen, 
  LayoutDashboard, 
  BookMarked, 
  DollarSign, 
  Library, 
  ArrowLeftRight, 
  Bookmark, 
  BarChart3, 
  Users, 
  Settings2,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const Sidebar = ({ currentTab, setCurrentTab, isCollapsed, onToggleCollapse }) => {
  const { currentUser } = useContext(LibraryContext);

  // Define tabs based on role
  const getTabsByRole = (role) => {
    switch (role) {
      case 'student':
        return [
          { id: 'student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'student-catalog', label: 'Library Catalog', icon: BookOpen },
          { id: 'student-fines', label: 'Fines & Payments', icon: DollarSign }
        ];
      case 'librarian':
        return [
          { id: 'lib-catalog', label: 'Book Inventory', icon: BookMarked },
          { id: 'lib-issue-return', label: 'Issue & Return', icon: ArrowLeftRight },
          { id: 'lib-reservations', label: 'Reservations', icon: Bookmark }
        ];
      case 'admin':
        return [
          { id: 'admin-dashboard', label: 'System Analytics', icon: BarChart3 },
          { id: 'admin-users', label: 'User Directory', icon: Users },
          { id: 'admin-settings', label: 'Library Settings', icon: Settings2 }
        ];
      default:
        return [];
    }
  };

  const menuItems = getTabsByRole(currentUser?.role || 'student');

  // Set default tab if current one is not applicable to current role
  React.useEffect(() => {
    const ids = menuItems.map(m => m.id);
    if (!ids.includes(currentTab)) {
      setCurrentTab(ids[0]);
    }
  }, [currentUser?.role, currentTab, setCurrentTab]);

  const userName = currentUser?.name || 'User';
  const userInitials = userName.substring(0, 2).toUpperCase();

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Library size={20} />
        </div>
        {!isCollapsed && (
          <span className="sidebar-title gradient-text">LIBRARY LMS</span>
        )}

        {/* Toggle Collapse Button inside header */}
        <button 
          className="sidebar-collapse-btn"
          onClick={onToggleCollapse}
          title={isCollapsed ? "Expand Sidebar (Unhide)" : "Collapse Sidebar (Hide)"}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <ul className="sidebar-menu">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <li key={item.id}>
              <a
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setCurrentTab(item.id)}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={18} className="sidebar-link-icon" />
                {!isCollapsed && <span>{item.label}</span>}
              </a>
            </li>
          );
        })}
      </ul>

      {/* Smart Recommendations Badge on Student Sidebar */}
      {currentUser?.role === 'student' && !isCollapsed && (
        <div style={{ padding: '0 1rem', marginBottom: '1rem' }}>
          <div 
            onClick={() => setCurrentTab('student-dashboard')}
            style={{ 
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: '12px',
              padding: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}
          >
            <Sparkles size={16} style={{ color: 'var(--accent-purple)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>AI Recommendations</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Top matched books</div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Profile */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {userInitials}
          </div>
          {!isCollapsed && (
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="sidebar-user-name" title={userName}>
                {userName}
              </div>
              <span className="sidebar-user-role">
                {currentUser?.role === 'admin' ? 'Administrator' : currentUser?.role}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
