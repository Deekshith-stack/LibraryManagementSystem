import React, { useContext, useState } from 'react';
import { LibraryContext } from '../../context/LibraryContext';
import { Modal } from '../Shared/Modal';
import { Plus, Edit2, Trash2, ShieldAlert, UserCheck, ShieldClose, UserX, Users } from 'lucide-react';

export const UserManagement = () => {
  const { users, addUser, updateUser, deleteUser } = useContext(LibraryContext);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [status, setStatus] = useState('active');

  const handleOpenAdd = () => {
    setModalMode('add');
    setName('');
    setEmail('');
    setRole('student');
    setStatus('active');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setStatus(user.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !role || !status) return;

    const userData = {
      name,
      email,
      role,
      status
    };

    if (modalMode === 'add') {
      addUser(userData);
    } else {
      updateUser({
        id: selectedUser.id,
        ...userData,
        enrollmentId: selectedUser.enrollmentId,
        employeeId: selectedUser.employeeId
      });
    }

    setIsModalOpen(false);
  };

  const handleToggleStatus = (user) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    updateUser({
      ...user,
      status: nextStatus
    });
  };

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user profile? All historical logs associated will remain but access will be revoked.")) {
      deleteUser(userId);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>User Directory</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage library access permissions, update profiles, and suspend/reactivate accounts.</p>
        </div>

        <button className="btn-premium primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Register User
        </button>
      </div>

      {/* Users directory table */}
      <div className="glass-card">
        {(users || []).length === 0 ? (
          <div className="empty-state">
            <Users size={48} className="empty-state-icon" />
            <h3 className="empty-state-title">Directory is empty</h3>
            <p className="empty-state-desc">Register new library users to see them listed here.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>User Profile</th>
                  <th>Email</th>
                  <th>Library ID</th>
                  <th>Access Role</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => {
                  const idToShow = user.role === 'student' ? user.enrollmentId : user.employeeId;
                  const isSuspended = user.status === 'suspended';
                  const initials = (user.name || 'U').substring(0, 2).toUpperCase();
                  
                  return (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className="sidebar-avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                            {initials}
                          </div>
                          <span style={{ fontWeight: 600 }}>{user.name}</span>
                        </div>
                      </td>
                      <td><code>{user.email}</code></td>
                      <td><code style={{ color: 'var(--accent-cyan)' }}>{idToShow || 'N/A'}</code></td>
                      <td>
                        <span className={`badge ${
                          user.role === 'admin' ? 'purple' : 
                          user.role === 'librarian' ? 'indigo' : 'cyan'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${isSuspended ? 'red' : 'green'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button 
                            className={`btn-premium ${isSuspended ? 'success' : 'danger'}`}
                            style={{ padding: '0.4rem', borderRadius: '6px' }}
                            title={isSuspended ? "Reactivate User" : "Suspend User"}
                            onClick={() => handleToggleStatus(user)}
                          >
                            {isSuspended ? <UserCheck size={14} /> : <UserX size={14} />}
                          </button>
                          
                          <button 
                            className="btn-premium secondary" 
                            style={{ padding: '0.4rem', borderRadius: '6px' }}
                            title="Edit Profile"
                            onClick={() => handleOpenEdit(user)}
                          >
                            <Edit2 size={14} />
                          </button>
                          
                          <button 
                            className="btn-premium danger" 
                            style={{ padding: '0.4rem', borderRadius: '6px' }}
                            title="Delete User"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 size={14} />
                          </button>
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

      {/* Register / Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Register Library User' : 'Edit User Profile'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="glass-input" 
              placeholder="e.g. Patron Name" 
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
              <label className="form-label">Access Role</label>
              <select 
                className="glass-input glass-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="student">Student Patron</option>
                <option value="librarian">Librarian</option>
                <option value="admin">System Administrator</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Access Status</label>
              <select 
                className="glass-input glass-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="active">Active (Full Access)</option>
                <option value="suspended">Suspended (Blocked)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn-premium secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-premium primary">
              {modalMode === 'add' ? 'Register Profile' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;
