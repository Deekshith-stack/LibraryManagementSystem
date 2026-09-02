import React, { useContext, useState, useEffect } from 'react';
import { LibraryContext } from '../../context/LibraryContext';
import { 
  Search, 
  Bell, 
  GraduationCap, 
  BookMarked, 
  ShieldCheck, 
  Menu, 
  ChevronRight,
  UserCheck,
  Check
} from 'lucide-react';
import NotificationCenterModal from './NotificationCenterModal';

export const Navbar = ({ searchVal, setSearchVal, isSidebarCollapsed, onToggleSidebar, onNavigateTab }) => {
  const { 
    currentUser, 
    users, 
    changeCurrentUser, 
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications
  } = useContext(LibraryContext);

  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const roleNotifications = notifications ? notifications.filter(n => n.role === currentUser?.role) : [];
  const unreadCount = roleNotifications.filter(n => !n.read).length;

  const handlePersonaSelect = (roleName) => {
    const targetUser = users.find(u => u.role === roleName);
    if (targetUser) {
      changeCurrentUser(targetUser.id);
      setIsPersonaOpen(false);
    }
  };

  const handleQuickNotifClick = (notif) => {
    markNotificationRead(notif.id);
    if (notif.actionTab && onNavigateTab) {
      onNavigateTab(notif.actionTab);
    }
    setIsNotifDropdownOpen(false);
  };

  const userName = currentUser?.name || 'User';
  const userInitials = userName.substring(0, 2).toUpperCase();

  const getRoleInfo = (role) => {
    switch (role) {
      case 'student': return { label: 'Student', color: 'cyan', icon: GraduationCap };
      case 'librarian': return { label: 'Librarian', color: 'green', icon: BookMarked };
      case 'admin': return { label: 'Admin', color: 'purple', icon: ShieldCheck };
      default: return { label: 'User', color: 'indigo', icon: UserCheck };
    }
  };

  const activeRoleInfo = getRoleInfo(currentUser?.role || 'student');
  const ActiveIcon = activeRoleInfo.icon;

  // Find representative users for the switcher options
  const studentUser = users.find(u => u.role === 'student');
  const librarianUser = users.find(u => u.role === 'librarian');
  const adminUser = users.find(u => u.role === 'admin');

  return (
    <>
      <nav className="navbar">
        {/* Navbar Left */}
        <div className="navbar-left">
          <button 
            className="navbar-toggle-btn"
            onClick={onToggleSidebar}
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            aria-label="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>

          <div className="search-container">
            <Search size={17} />
            <input
              type="text"
              className="glass-input"
              placeholder="Search catalog..."
              value={searchVal || ''}
              onChange={(e) => setSearchVal && setSearchVal(e.target.value)}
            />
            <span className="search-kbd">⌘K</span>
          </div>
        </div>

        {/* Navbar Center - Centered Title */}
        <div className="navbar-center" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ 
            fontFamily: 'Outfit, sans-serif', 
            fontWeight: 900, 
            fontSize: '1.45rem', 
            letterSpacing: '1px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 50%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent'
          }}>
            LMS
          </span>
        </div>

        {/* Navbar Right */}
        <div className="navbar-right">
          <div className="live-status-pill">
            <span className="live-dot"></span>
            <span>Live • {currentTime}</span>
          </div>

          {/* Notifications Bell Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              className={`notif-btn ${unreadCount > 0 ? 'has-unread' : ''}`} 
              onClick={() => {
                setIsNotifDropdownOpen(!isNotifDropdownOpen);
                setIsPersonaOpen(false);
              }}
              title="Notifications"
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="notif-count">{unreadCount}</span>
              )}
            </button>

            {isNotifDropdownOpen && (
              <div className="notif-dropdown">
                <div className="notif-dropdown-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.925rem', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
                      Notifications
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

                <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {roleNotifications.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic', textAlign: 'center', padding: '1.5rem 0' }}>
                      No notifications.
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

                <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
                  <button 
                    className="btn-premium secondary"
                    style={{ width: '100%', padding: '0.45rem', fontSize: '0.78rem', borderRadius: '10px', gap: '0.3rem' }}
                    onClick={() => {
                      setIsNotifDropdownOpen(false);
                      setIsNotifModalOpen(true);
                    }}
                  >
                    Open Notification Center <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile & Switcher Button */}
          <div style={{ position: 'relative' }}>
            <button 
              className="nav-profile-btn"
              onClick={() => {
                setIsPersonaOpen(!isPersonaOpen);
                setIsNotifDropdownOpen(false);
              }}
              title="Switch Profile"
            >
              <div className={`nav-profile-avatar ${currentUser?.role}`}>
                {userInitials}
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {userName}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  {activeRoleInfo.label}
                </div>
              </div>
              <ActiveIcon size={14} style={{ color: `var(--accent-${activeRoleInfo.color})`, marginLeft: '0.2rem' }} />
            </button>

            {/* Persona Switcher Popover */}
            {isPersonaOpen && (
              <div className="persona-popover">
                <div className="persona-header">
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
                      Switch User
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Select account
                    </div>
                  </div>
                  <span className={`badge ${activeRoleInfo.color}`} style={{ fontSize: '0.65rem' }}>
                    {activeRoleInfo.label}
                  </span>
                </div>

                <div className="persona-options">
                  {/* Student Option */}
                  <button 
                    className={`persona-option ${currentUser?.role === 'student' ? 'active' : ''}`}
                    onClick={() => handlePersonaSelect('student')}
                  >
                    <div className="persona-icon-box student">
                      <GraduationCap size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{studentUser?.name || 'a'}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Student</div>
                    </div>
                    {currentUser?.role === 'student' && <Check size={16} style={{ color: 'var(--accent-cyan)' }} />}
                  </button>

                  {/* Librarian Option */}
                  <button 
                    className={`persona-option ${currentUser?.role === 'librarian' ? 'active' : ''}`}
                    onClick={() => handlePersonaSelect('librarian')}
                  >
                    <div className="persona-icon-box librarian">
                      <BookMarked size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{librarianUser?.name || 'Librarian'}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Librarian</div>
                    </div>
                    {currentUser?.role === 'librarian' && <Check size={16} style={{ color: 'var(--accent-green)' }} />}
                  </button>

                  {/* Admin Option */}
                  <button 
                    className={`persona-option ${currentUser?.role === 'admin' ? 'active' : ''}`}
                    onClick={() => handlePersonaSelect('admin')}
                  >
                    <div className="persona-icon-box admin">
                      <ShieldCheck size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{adminUser?.name || 'Admin'}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Admin</div>
                    </div>
                    {currentUser?.role === 'admin' && <Check size={16} style={{ color: 'var(--accent-purple)' }} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <NotificationCenterModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        onNavigateTab={onNavigateTab}
      />
    </>
  );
};

export default Navbar;
