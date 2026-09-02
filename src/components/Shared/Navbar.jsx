import React, { useContext, useState } from 'react';
import { LibraryContext } from '../../context/LibraryContext';
import { 
  Search, 
  Bell, 
  Shield, 
  User, 
  Users, 
  Menu, 
  Sparkles, 
  Check, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';
import NotificationCenterModal from './NotificationCenterModal';

export const Navbar = ({ searchVal, setSearchVal, isSidebarCollapsed, onToggleSidebar, onNavigateTab }) => {
  const { 
    currentUser, 
    users, 
    changeCurrentUser, 
    sessions,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications
  } = useContext(LibraryContext);

  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);

  const userSession = (sessions && sessions[currentUser?.id]) || { login: '09:00 AM', logout: 'Never' };
  
  // Filter notifications corresponding to the active role
  const roleNotifications = notifications ? notifications.filter(n => n.role === currentUser?.role) : [];
  const unreadCount = roleNotifications.filter(n => !n.read).length;

  // Switch role defaults
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    const defaultUserOfRole = users.find(u => u.role === selectedRole);
    if (defaultUserOfRole) {
      changeCurrentUser(defaultUserOfRole.id);
      setIsNotifDropdownOpen(false);
    }
  };

  const handleUserChange = (e) => {
    changeCurrentUser(e.target.value);
    setIsNotifDropdownOpen(false);
  };

  const usersOfCurrentRole = users.filter(u => u.role === currentUser?.role);

  const handleQuickNotifClick = (notif) => {
    markNotificationRead(notif.id);
    if (notif.actionTab && onNavigateTab) {
      onNavigateTab(notif.actionTab);
    }
    setIsNotifDropdownOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          {/* Sidebar Hide/Unhide Toggle Button */}
          <button 
            className="navbar-toggle-btn"
            onClick={onToggleSidebar}
            title={isSidebarCollapsed ? "Unhide Sidebar" : "Hide Sidebar"}
            aria-label="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>

          {/* Search bar */}
          <div className="search-container">
            <Search size={18} />
            <input
              type="text"
              className="glass-input"
              placeholder="Search catalog, books, ISBN, or loans..."
              value={searchVal || ''}
              onChange={(e) => setSearchVal && setSearchVal(e.target.value)}
            />
          </div>
        </div>

        <div className="navbar-right">
          {/* Role & User Switcher */}
          <div className="role-switcher-container">
            <Shield size={14} style={{ color: 'var(--accent-cyan)' }} />
            <span className="role-switcher-label">Role:</span>
            <select 
              className="role-select" 
              value={currentUser?.role || 'student'} 
              onChange={handleRoleChange}
            >
              <option value="student">Student</option>
              <option value="librarian">Librarian</option>
              <option value="admin">System Admin</option>
            </select>
          </div>

          <div className="role-switcher-container">
            <Users size={14} style={{ color: 'var(--accent-indigo)' }} />
            <span className="role-switcher-label">User:</span>
            <select 
              className="role-select" 
              value={currentUser?.id} 
              onChange={handleUserChange}
            >
              {usersOfCurrentRole.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} {u.status === 'suspended' ? '(Suspended)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Session Log Box */}
          <div className="session-box">
            <div className="session-time login">
              <span className="dot green"></span>
              <span>In: {userSession.login}</span>
            </div>
            <div className="session-time logout">
              <span className="dot red"></span>
              <span>Out: {userSession.logout}</span>
            </div>
          </div>

          {/* Notifications Bell Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              className={`notif-btn ${unreadCount > 0 ? 'has-unread' : ''}`} 
              onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
              title="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="notif-count">{unreadCount}</span>
              )}
            </button>

            {isNotifDropdownOpen && (
              <div className="notif-dropdown">
                <div className="notif-dropdown-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="badge red" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                        {unreadCount} new
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {unreadCount > 0 && (
                      <button 
                        style={{ border: 'none', background: 'transparent', color: 'var(--accent-cyan)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                        onClick={() => markAllNotificationsRead(currentUser?.role)}
                      >
                        Read All
                      </button>
                    )}
                    {roleNotifications.length > 0 && (
                      <button 
                        style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}
                        onClick={() => {
                          clearNotifications(currentUser?.role);
                          setIsNotifDropdownOpen(false);
                        }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Dropdown Items list */}
                <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {roleNotifications.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic', textAlign: 'center', padding: '1.5rem 0' }}>
                      No notifications for this role.
                    </p>
                  ) : (
                    roleNotifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`notif-item ${notif.read ? '' : 'unread'}`}
                        style={{
                          padding: '0.6rem 0.75rem',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          background: notif.read ? 'rgba(255,255,255,0.015)' : 'rgba(99, 102, 241, 0.1)',
                          border: '1px solid',
                          borderColor: notif.read ? 'rgba(255,255,255,0.03)' : 'rgba(99, 102, 241, 0.3)',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => handleQuickNotifClick(notif)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                          <span style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase' }}>
                            {notif.type ? notif.type.replace('_', ' ') : 'ALERT'}
                          </span>
                          <span className="notif-item-time" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                            {notif.timestamp}
                          </span>
                        </div>
                        <span className="notif-item-text" style={{ display: 'block', color: 'var(--text-primary)', fontWeight: notif.read ? 400 : 600, lineHeight: 1.3 }}>
                          {notif.text}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer link to open full notification center */}
                <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
                  <button 
                    className="btn-premium secondary"
                    style={{ width: '100%', padding: '0.4rem', fontSize: '0.78rem', borderRadius: '8px' }}
                    onClick={() => {
                      setIsNotifDropdownOpen(false);
                      setIsNotifModalOpen(true);
                    }}
                  >
                    Open Notification Center <ChevronRight size={12} style={{ display: 'inline', marginLeft: '2px' }} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Dedicated Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        onNavigateTab={onNavigateTab}
      />
    </>
  );
};

export default Navbar;
