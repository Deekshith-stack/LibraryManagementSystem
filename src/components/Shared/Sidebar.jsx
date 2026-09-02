import React, { useContext } from 'react';
import { LibraryContext } from '../../context/LibraryContext';
import { 
  BookOpen, 
  LayoutDashboard, 
  BookMarked, 
  DollarSign, 
  ArrowLeftRight, 
  Bookmark, 
  BarChart3, 
  Users, 
  Settings2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';

export const Sidebar = ({ currentTab, setCurrentTab, isCollapsed, onToggleCollapse }) => {
  const { currentUser, changeCurrentUser, users } = useContext(LibraryContext);

  // Define tabs based on role
  const getTabsByRole = (role) => {
    switch (role) {
      case 'student':
        return [
          { id: 'student-dashboard', label: 'Scholar Dashboard', icon: LayoutDashboard },
          { id: 'student-catalog', label: 'Library Catalog', icon: BookOpen },
          { id: 'student-fines', label: 'Fines & Payments', icon: DollarSign }
        ];
      case 'librarian':
        return [
          { id: 'lib-catalog', label: 'Book Inventory', icon: BookMarked },
          { id: 'lib-issue-return', label: 'Issue & Return Desk', icon: ArrowLeftRight },
          { id: 'lib-reservations', label: 'Hold Queue', icon: Bookmark }
        ];
      case 'admin':
        return [
          { id: 'admin-dashboard', label: 'Apex Analytics', icon: BarChart3 },
          { id: 'admin-users', label: 'User Directory', icon: Users },
          { id: 'admin-settings', label: 'Circulation Policies', icon: Settings2 }
        ];
      default:
        return [];
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'student': return { name: 'Scholar Edition', color: 'cyan' };
      case 'librarian': return { name: 'Circulation Ops', color: 'green' };
      case 'admin': return { name: 'Apex Console', color: 'purple' };
      default: return { name: 'Edition', color: 'indigo' };
    }
  };

  const menuItems = getTabsByRole(currentUser?.role || 'student');
  const roleBadge = getRoleBadge(currentUser?.role || 'student');

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
        <div className="sidebar-logo" style={{ background: 'var(--gradient-aetheria)' }}>
          <Zap size={20} />
        </div>
        {!isCollapsed && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="sidebar-title gradient-text">AETHERIA</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {roleBadge.name}
            </span>
          </div>
        )}

        {/* Toggle Collapse Button */}
        <button 
          className="sidebar-collapse-btn"
          onClick={onToggleCollapse}
          title={isCollapsed ? "Expand Sidebar (Unhide)" : "Collapse Sidebar (Hide)"}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
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

      {/* Scholar AI Badge */}
      {currentUser?.role === 'student' && !isCollapsed && (
        <div style={{ padding: '0 1rem', marginBottom: '1.25rem' }}>
          <div 
            onClick={() => setCurrentTab('student-dashboard')}
            style={{ 
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: '14px',
              padding: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={16} style={{ color: 'var(--accent-purple)' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)' }}>AI Recommendations</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Personalized matches</div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Profile */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar" style={{ background: currentUser?.role === 'admin' ? 'var(--gradient-apex)' : currentUser?.role === 'librarian' ? 'var(--gradient-circulation)' : 'var(--gradient-scholar)' }}>
            {userInitials}
          </div>
          {!isCollapsed && (
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="sidebar-user-name" title={userName}>
                {userName}
              </div>
              <span className={`badge ${roleBadge.color}`} style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem', marginTop: '0.2rem' }}>
                {currentUser?.role}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
