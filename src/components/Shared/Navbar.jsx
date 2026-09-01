import React, { useContext, useState } from 'react';
import { LibraryContext } from '../../context/LibraryContext';
import { Search, Bell, Shield, User, Users } from 'lucide-react';

export const Navbar = ({ searchVal, setSearchVal }) => {
  const { 
    currentUser, 
    users, 
    changeCurrentUser, 
    sessions,
    notifications,
    markNotificationRead,
    clearNotifications
  } = useContext(LibraryContext);

  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  const userSession = (sessions && sessions[currentUser.id]) || { login: 'Never', logout: 'Never' };
  
  // Filter notifications corresponding to the active role
  const roleNotifications = notifications ? notifications.filter(n => n.role === currentUser.role) : [];
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

  const usersOfCurrentRole = users.filter(u => u.role === currentUser.role);

  return (
    <nav className="navbar" style={{ position: 'relative' }}>
      <div className="navbar-left">
        <div className="search-container">
          <Search size={18} />
          <input
            type="text"
            className="glass-input"
            placeholder="Search catalog, users, transactions..."
            value={searchVal || ''}
            onChange={(e) => setSearchVal && setSearchVal(e.target.value)}
          />
        </div>
      </div>

      <div className="navbar-right">
        {/* Role & User Switcher for Demonstration purposes */}
        <div className="role-switcher-container">
          <Shield size={14} className="gradient-text" style={{ color: 'var(--accent-cyan)' }} />
          <span className="role-switcher-label">Role:</span>
          <select 
            className="role-select" 
            value={currentUser.role} 
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
            value={currentUser.id} 
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

        {/* Notifications Bell */}
        <div style={{ position: 'relative' }}>
          <button className="notif-btn" onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}>
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notif-count">{unreadCount}</span>
            )}
          </button>

          {isNotifDropdownOpen && (
            <div className="notif-dropdown">
              <div className="notif-dropdown-header">
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  Notifications ({roleNotifications.length})
                </span>
                {roleNotifications.length > 0 && (
                  <button 
                    style={{ border: 'none', background: 'transparent', color: 'var(--accent-cyan)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 }}
                    onClick={() => {
                      clearNotifications(currentUser.role);
                      setIsNotifDropdownOpen(false);
                    }}
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {roleNotifications.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic', textAlign: 'center', padding: '1rem 0' }}>
                    No notifications for this role.
                  </p>
                ) : (
                  roleNotifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className={`notif-item ${notif.read ? '' : 'unread'}`}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        background: notif.read ? 'rgba(255,255,255,0.015)' : 'rgba(99, 102, 241, 0.08)',
                        border: '1px solid',
                        borderColor: notif.read ? 'rgba(255,255,255,0.03)' : 'rgba(99, 102, 241, 0.25)',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => markNotificationRead(notif.id)}
                    >
                      <span className="notif-item-text" style={{ display: 'block', color: 'var(--text-primary)', fontWeight: notif.read ? 400 : 700, lineHeight: 1.3 }}>
                        {notif.text}
                      </span>
                      <span className="notif-item-time" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {notif.timestamp}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
