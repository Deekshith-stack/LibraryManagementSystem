import React, { useContext, useState } from 'react';
import { LibraryContext } from '../../context/LibraryContext';
import { Modal } from './Modal';
import { 
  Bell, 
  AlertTriangle, 
  BookOpen, 
  Sparkles, 
  Info, 
  Check, 
  CheckCheck, 
  Trash2, 
  ExternalLink,
  DollarSign
} from 'lucide-react';

export const NotificationCenterModal = ({ isOpen, onClose, onNavigateTab }) => {
  const { 
    currentUser, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    deleteNotification, 
    clearNotifications 
  } = useContext(LibraryContext);

  const [filterType, setFilterType] = useState('all'); // 'all' | 'unread' | 'due' | 'fine' | 'reservation' | 'new_arrival'

  // Filter notifications corresponding to current user role
  const roleNotifs = (notifications || []).filter(n => n.role === currentUser?.role);

  const filteredNotifs = roleNotifs.filter(n => {
    if (filterType === 'unread') return !n.read;
    if (filterType === 'due') return n.type === 'due';
    if (filterType === 'fine') return n.type === 'fine';
    if (filterType === 'reservation') return n.type === 'reservation';
    if (filterType === 'new_arrival') return n.type === 'new_arrival';
    return true;
  });

  const unreadCount = roleNotifs.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'due':
        return <Bell size={18} style={{ color: 'var(--accent-cyan)' }} />;
      case 'fine':
        return <AlertTriangle size={18} style={{ color: 'var(--accent-red)' }} />;
      case 'reservation':
        return <BookOpen size={18} style={{ color: 'var(--accent-indigo)' }} />;
      case 'new_arrival':
        return <Sparkles size={18} style={{ color: 'var(--accent-purple)' }} />;
      default:
        return <Info size={18} style={{ color: 'var(--text-secondary)' }} />;
    }
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case 'due': return 'cyan';
      case 'fine': return 'red';
      case 'reservation': return 'indigo';
      case 'new_arrival': return 'purple';
      default: return 'green';
    }
  };

  const handleNotificationAction = (notif) => {
    markNotificationRead(notif.id);
    if (notif.actionTab && onNavigateTab) {
      onNavigateTab(notif.actionTab);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Notification Center"
    >
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Top summary & Action Bar */}
        <div className="flex-between" style={{ paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Active Alerts ({roleNotifs.length})
            </span>
            {unreadCount > 0 && (
              <span className="badge red" style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem' }}>
                {unreadCount} Unread
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {unreadCount > 0 && (
              <button
                className="btn-premium secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                onClick={() => markAllNotificationsRead(currentUser?.role)}
              >
                <CheckCheck size={14} /> Mark All Read
              </button>
            )}
            {roleNotifs.length > 0 && (
              <button
                className="btn-premium danger"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                onClick={() => clearNotifications(currentUser?.role)}
              >
                <Trash2 size={13} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {[
            { id: 'all', label: 'All Alerts' },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'due', label: '🔔 Due Soon' },
            { id: 'fine', label: '⚠️ Fines' },
            { id: 'reservation', label: '📚 Holds' },
            { id: 'new_arrival', label: '🎉 New Books' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${filterType === tab.id ? 'active' : ''}`}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.78rem',
                borderRadius: '8px',
                borderBottom: 'none',
                background: filterType === tab.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                border: filterType === tab.id ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-color)',
                color: filterType === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                whiteSpace: 'nowrap'
              }}
              onClick={() => setFilterType(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div style={{ maxHeight: '360px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingRight: '0.25rem' }}>
          {filteredNotifs.length === 0 ? (
            <div className="empty-state" style={{ padding: '2.5rem 1rem' }}>
              <Bell size={36} className="empty-state-icon" style={{ opacity: 0.5 }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                No notifications in this category
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                You are all caught up with your library alerts.
              </p>
            </div>
          ) : (
            filteredNotifs.map(notif => (
              <div
                key={notif.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  background: notif.read ? 'rgba(15, 23, 42, 0.4)' : 'rgba(99, 102, 241, 0.08)',
                  border: `1px solid ${notif.read ? 'rgba(255, 255, 255, 0.04)' : 'rgba(99, 102, 241, 0.3)'}`,
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {getNotificationIcon(notif.type)}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                    <span className={`badge ${getBadgeColor(notif.type)}`} style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem', textTransform: 'uppercase' }}>
                      {notif.type ? notif.type.replace('_', ' ') : 'ALERT'}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                      {notif.timestamp}
                    </span>
                  </div>

                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: notif.read ? 'var(--text-secondary)' : 'var(--text-primary)', 
                    fontWeight: notif.read ? 400 : 600,
                    lineHeight: 1.4,
                    marginBottom: '0.5rem'
                  }}>
                    {notif.text}
                  </p>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {notif.actionTab && (
                      <button
                        className="btn-premium primary"
                        style={{ padding: '0.25rem 0.65rem', fontSize: '0.725rem', borderRadius: '6px' }}
                        onClick={() => handleNotificationAction(notif)}
                      >
                        <ExternalLink size={12} /> Open View
                      </button>
                    )}
                    {!notif.read && (
                      <button
                        className="btn-premium secondary"
                        style={{ padding: '0.25rem 0.65rem', fontSize: '0.725rem', borderRadius: '6px' }}
                        onClick={() => markNotificationRead(notif.id)}
                      >
                        <Check size={12} /> Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      title="Dismiss"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        marginLeft: 'auto',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};

export default NotificationCenterModal;
