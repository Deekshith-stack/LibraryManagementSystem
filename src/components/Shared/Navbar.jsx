import React, { useContext, useState } from 'react';
import { LibraryContext } from '../../context/LibraryContext';
import { 
  Search, 
  Bell, 
  GraduationCap, 
  BookMarked, 
  ShieldCheck, 
  Users, 
  Menu, 
  Sparkles, 
  ChevronRight,
  UserCheck
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
  const handleRoleSelect = (selectedRole) => {
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
          {/* Sidebar Toggle Button */}
          <button 
            className="navbar-toggle-btn"
            onClick={onToggleSidebar}
            title={isSidebarCollapsed ? "Unhide Sidebar" : "Hide Sidebar"}
            aria-label="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>

          {/* Search bar with Ctrl+K */}
          <div className="search-container">
            <Search size={18} />
            <input
              type="text"
              className="glass-input"
              placeholder="Search Lumina Catalog..."
              value={searchVal || ''}
              onChange={(e) => setSearchVal && setSearchVal(e.target.value)}
            />
            <span className="search-kbd">⌘K</span>
          </div>
        </div>

        <div className="navbar-right">
          {/* Interactive Role Switcher Pills */}
          <div className="role-pill-group" title="Switch Portal Environment">
            <button
              className={`role-pill-btn ${currentUser?.role === 'student' ? 'active student' : ''}`}
              onClick={() => handleRoleSelect('student')}
            >
              <GraduationCap size={15} />
              <span>Scholar</span>
            </button>
            <button
              className={`role-pill-btn ${currentUser?.role === 'librarian' ? 'active librarian' : ''}`}
              onClick={() => handleRoleSelect('librarian')}
            >
              <BookMarked size={15} />
              <span>Circulation</span>
            </button>
            <button
              className={`role-pill-btn ${currentUser?.role === 'admin' ? 'active admin' : ''}`}
              onClick={() => handleRoleSelect('admin')}
            >
              <ShieldCheck size={15} />
              <span>Apex Admin</span>
            </button>
          </div>

          {/* User selector if multiple exist in role */}
          {usersOfCurrentRole.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(15, 23, 42, 0.65)', border: '1px solid var(--border-color)', padding: '0.3rem 0.65rem', borderRadius: '12px' }}>
              <Users size={14} style={{ color: 'var(--accent-indigo)' }} />
              <select 
                className="role-select" 
                value={currentUser?.id} 
                onChange={handleUserChange}
                style={{ fontSize: '0.8rem' }}
              >
                {usersOfCurrentRole.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          )}

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
                    <span style={{ fontWeight: 800, fontSize: '0.925rem', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
                      Notification Center
                    </span>
                    {unreadCount > 0 && (
                      <span className="badge red" style={{ fontSize: '0.65rem', padding: '0.1rem 0.45rem' }}>
                        {unreadCount} new
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {unreadCount > 0 && (
                      <button 
                        style={{ border: 'none', background: 'transparent', color: 'var(--accent-cyan)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 }}
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
                <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
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
                          padding: '0.65rem 0.85rem',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          fontSize: '0.825rem',
                          background: notif.read ? 'rgba(255,255,255,0.015)' : 'rgba(99, 102, 241, 0.1)',
                          border: '1px solid',
                          borderColor: notif.read ? 'rgba(255,255,255,0.04)' : 'rgba(99, 102, 241, 0.3)',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => handleQuickNotifClick(notif)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                          <span style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {notif.type ? notif.type.replace('_', ' ') : 'ALERT'}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                            {notif.timestamp}
                          </span>
                        </div>
                        <span style={{ display: 'block', color: 'var(--text-primary)', fontWeight: notif.read ? 400 : 600, lineHeight: 1.35 }}>
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
                    style={{ width: '100%', padding: '0.45rem', fontSize: '0.78rem', borderRadius: '10px', gap: '0.3rem' }}
                    onClick={() => {
                      setIsNotifDropdownOpen(false);
                      setIsNotifModalOpen(true);
                    }}
                  >
                    Open Full Notification Center <ChevronRight size={13} />
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
