import React, { useContext, useState } from 'react';
import { LibraryContext } from '../../context/LibraryContext';
import { Modal } from '../Shared/Modal';
import { Plus, Edit2, Trash2, UserCheck, UserX, Shield, GraduationCap, BookMarked, Search, Users } from 'lucide-react';

export const UserManagement = ({ searchVal }) => {
  const { users, addUser, updateUser, deleteUser, currentUser } = useContext(LibraryContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [enrollmentId, setEnrollmentId] = useState('');
  const [status, setStatus] = useState('active');

  const handleOpenAdd = () => {
    setModalMode('add');
    setName('');
    setEmail('');
    setRole('student');
    setEnrollmentId(`STU-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
    setStatus('active');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setEnrollmentId(user.enrollmentId || '');
    setStatus(user.status);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (user) => {
    if (user.id === currentUser?.id) {
      alert("You cannot toggle your own active session status.");
      return;
    }
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    updateUser({
      ...user,
      status: newStatus
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !role) return;

    const userData = {
      name,
      email,
      role,
      enrollmentId,
      status
    };

    if (modalMode === 'add') {
      addUser(userData);
    } else {
      updateUser({
        id: selectedUser.id,
        ...userData
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (userId) => {
    if (userId === currentUser?.id) {
      alert("You cannot remove your own active administrator account.");
      return;
    }

    if (window.confirm("Permanently remove this user record from directory?")) {
      deleteUser(userId);
    }
  };

  const filteredUsers = (users || []).filter(u => {
    return (
      u.name.toLowerCase().includes((searchVal || '').toLowerCase()) ||
      u.email.toLowerCase().includes((searchVal || '').toLowerCase()) ||
      (u.enrollmentId && u.enrollmentId.toLowerCase().includes((searchVal || '').toLowerCase())) ||
      u.role.toLowerCase().includes((searchVal || '').toLowerCase())
    );
  });

  return (
    <div className="animate-fade-in">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="gradient-text-apex" style={{ fontSize: '2rem', marginBottom: '0.25rem', fontFamily: 'Outfit, sans-serif' }}>
            Patron & Staff Directory
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage role-based privileges, enrollment credentials, and member account permissions.</p>
        </div>

        <button className="btn-premium primary" style={{ background: 'var(--gradient-apex)' }} onClick={handleOpenAdd}>
          <Plus size={18} /> Register Member
        </button>
      </div>

      {/* Users Table */}
      <div className="glass-card">
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <Users size={44} className="empty-state-icon" />
            <h3 className="empty-state-title">No matching member records</h3>
            <p className="empty-state-desc">Try clearing search parameters to display all registered patrons.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Role & Access</th>
                  <th>ID / Code</th>
                  <th>Email</th>
                  <th>Account Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => {
                  const isCurrent = user.id === currentUser?.id;
                  const initials = (user.name || 'U').substring(0, 2).toUpperCase();

                  return (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ 
                            width: '36px', 
                            height: '36px', 
                            borderRadius: '50%', 
                            background: user.role === 'admin' ? 'var(--gradient-apex)' : user.role === 'librarian' ? 'var(--gradient-circulation)' : 'var(--gradient-scholar)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            color: 'white',
                            flexShrink: 0
                          }}>
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700 }}>
                              {user.name} {isCurrent && <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>(You)</span>}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Joined: {user.joinDate || '2026'}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${user.role === 'admin' ? 'purple' : user.role === 'librarian' ? 'green' : 'cyan'}`} style={{ gap: '0.25rem', display: 'inline-flex' }}>
                          {user.role === 'admin' && <Shield size={12} />}
                          {user.role === 'librarian' && <BookMarked size={12} />}
                          {user.role === 'student' && <GraduationCap size={12} />}
                          {user.role}
                        </span>
                      </td>
                      <td><code>{user.enrollmentId || 'N/A'}</code></td>
                      <td style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                      <td>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          style={{ border: 'none', background: 'transparent', cursor: isCurrent ? 'default' : 'pointer' }}
                          title={isCurrent ? "Active Session" : "Click to toggle status"}
                          disabled={isCurrent}
                        >
                          <span className={`badge ${user.status === 'active' ? 'green' : 'red'}`}>
                            {user.status === 'active' ? <UserCheck size={12} style={{ marginRight: '3px' }} /> : <UserX size={12} style={{ marginRight: '3px' }} />}
                            {user.status}
                          </span>
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button
                            className="btn-premium secondary"
                            style={{ padding: '0.45rem', borderRadius: '8px' }}
                            title="Edit Member Data"
                            onClick={() => handleOpenEdit(user)}
                          >
                            <Edit2 size={14} />
                          </button>
                          {!isCurrent && (
                            <button
                              className="btn-premium danger"
                              style={{ padding: '0.45rem', borderRadius: '8px' }}
                              title="Delete Member"
                              onClick={() => handleDelete(user.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Register New Member' : 'Modify Member Credentials'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="glass-input"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="glass-input"
              placeholder="e.g. user@library.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid-gap-2">
            <div className="form-group">
              <label className="form-label">Assigned Role</label>
              <select
                className="glass-input glass-select"
                value={role}
                onChange={(e) => {
                  const newRole = e.target.value;
                  setRole(newRole);
                  const prefix = newRole === 'admin' ? 'ADM' : newRole === 'librarian' ? 'LIB' : 'STU';
                  setEnrollmentId(`${prefix}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
                }}
              >
                <option value="student">Student</option>
                <option value="librarian">Librarian</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Credential ID</label>
              <input
                type="text"
                className="glass-input"
                value={enrollmentId}
                onChange={(e) => setEnrollmentId(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Account Standing Status</label>
            <select
              className="glass-input glass-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="active">Active (Full Borrowing Privileges)</option>
              <option value="suspended">Suspended (Borrowing Frozen)</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn-premium secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-premium primary" style={{ background: 'var(--gradient-apex)' }}>
              {modalMode === 'add' ? 'Confirm Registration' : 'Update Credentials'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;
