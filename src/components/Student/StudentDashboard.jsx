import React, { useContext, useState } from 'react';
import { LibraryContext } from '../../context/LibraryContext';
import { BookOpen, Calendar, AlertTriangle, CheckCircle2, History, Award, Flame } from 'lucide-react';
import SmartRecommendations from './SmartRecommendations';

export const StudentDashboard = ({ onNavigateTab }) => {
  const { currentUser, transactions, reservations, books } = useContext(LibraryContext);
  const [dashboardTab, setDashboardTab] = useState('active'); // 'active' | 'history'

  // Filter student transactions
  const studentTxs = (transactions || []).filter(t => t.studentId === currentUser?.id);
  const activeTxs = studentTxs.filter(t => !t.returnDate);
  const historyTxs = studentTxs.filter(t => t.returnDate);
  const overdueTxs = activeTxs.filter(t => t.status === 'overdue');
  const studentReservations = (reservations || []).filter(r => r.studentId === currentUser?.id);

  // Statistics calculation
  const totalIssued = activeTxs.length;
  const overdueCount = overdueTxs.length;
  const totalFines = activeTxs.reduce((sum, tx) => sum + tx.fineAmount, 0);

  // Dynamic Favorite Category computation
  const getFavoriteCategory = () => {
    if (studentTxs.length === 0) return 'Programming';
    
    const catCounts = {};
    studentTxs.forEach(tx => {
      const bookObj = books.find(b => b.id === tx.bookId);
      if (bookObj) {
        catCounts[bookObj.category] = (catCounts[bookObj.category] || 0) + 1;
      }
    });

    const sorted = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : 'Programming';
  };

  const favoriteGenre = getFavoriteCategory();

  const getDaysRemaining = (dueDate) => {
    const today = new Date().toISOString().split('T')[0];
    const due = new Date(dueDate);
    const now = new Date(today);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="animate-fade-in">
      {/* Student Header */}
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge cyan" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
              Student
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              • Enrollment: <code style={{ color: 'var(--accent-cyan)' }}>{currentUser?.enrollmentId}</code>
            </span>
          </div>
          <h1 className="gradient-text" style={{ fontSize: '2.1rem', marginBottom: '0.25rem', fontFamily: 'Outfit, sans-serif' }}>
            Welcome back, {currentUser?.name}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            Track your active borrowed books, reservations, and smart recommendations.
          </p>
        </div>

        {/* Reading Streak pill */}
        <div style={{ 
          background: 'rgba(15, 23, 42, 0.6)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '16px', 
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame size={18} style={{ color: 'var(--accent-orange)' }} />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>5 Day Streak</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Daily Reading Goal</div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon cyan">
            <BookOpen size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{totalIssued}</span>
            <span className="stat-title">Active Loans</span>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon purple">
            <Award size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value" style={{ fontSize: '1.25rem', fontWeight: 800, padding: '0.2rem 0' }}>
              {favoriteGenre.length > 18 ? `${favoriteGenre.substring(0, 15)}...` : favoriteGenre}
            </span>
            <span className="stat-title">Top Category</span>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon red">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{overdueCount}</span>
            <span className="stat-title">Overdue Items</span>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon green">
            <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>₹</span>
          </div>
          <div className="stat-details">
            <span className="stat-value">₹{totalFines.toFixed(2)}</span>
            <span className="stat-title">Pending Fines</span>
          </div>
        </div>
      </div>

      {/* ⭐ Priority 4: Smart Book Recommendations */}
      <SmartRecommendations onNavigateToCatalog={onNavigateTab} />

      {/* Tab Selectors */}
      <div className="tabs-header" style={{ marginBottom: '1.5rem' }}>
        <button 
          className={`tab-btn ${dashboardTab === 'active' ? 'active' : ''}`}
          onClick={() => setDashboardTab('active')}
        >
          Active Borrowings ({activeTxs.length})
        </button>
        <button 
          className={`tab-btn ${dashboardTab === 'history' ? 'active' : ''}`}
          onClick={() => setDashboardTab('history')}
        >
          <History size={14} style={{ marginRight: '0.3rem' }} /> Lending History ({historyTxs.length})
        </button>
      </div>

      {/* Tab content */}
      {dashboardTab === 'active' ? (
        <div className="glass-card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>
            <BookOpen size={20} style={{ color: 'var(--accent-cyan)' }} /> Current Borrowings
          </h2>

          {activeTxs.length === 0 ? (
            <div className="empty-state">
              <CheckCircle2 size={44} className="empty-state-icon" style={{ color: 'var(--accent-green)' }} />
              <h3 className="empty-state-title">All Clear!</h3>
              <p className="empty-state-desc">You don't have any books currently checked out. Browse the catalog to borrow your next read!</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Book Title</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Time Left</th>
                    <th>Fines Accumulated</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTxs.map(tx => {
                    const daysLeft = getDaysRemaining(tx.dueDate);
                    const isOverdue = daysLeft < 0;
                    return (
                      <tr key={tx.id}>
                        <td style={{ fontWeight: 600 }}>{tx.bookTitle}</td>
                        <td>{tx.issueDate}</td>
                        <td>{tx.dueDate}</td>
                        <td>
                          {isOverdue ? (
                            <span style={{ color: 'var(--accent-red)', fontWeight: 700 }}>
                              {Math.abs(daysLeft)} days overdue
                            </span>
                          ) : (
                            <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>
                              {daysLeft} days left
                            </span>
                          )}
                        </td>
                        <td style={{ color: tx.fineAmount > 0 ? 'var(--accent-red)' : 'var(--text-primary)', fontWeight: tx.fineAmount > 0 ? 700 : 400 }}>
                          ₹{tx.fineAmount.toFixed(2)}
                        </td>
                        <td>
                          <span className={`badge ${isOverdue ? 'red' : 'green'}`}>
                            {isOverdue ? 'overdue' : 'active'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>
            <History size={20} style={{ color: 'var(--accent-cyan)' }} /> Returned Books Records
          </h2>

          {historyTxs.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-desc">You have not completed any book returns yet.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Book Title</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Return Date</th>
                    <th>Fines Assessed</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {historyTxs.map(tx => (
                    <tr key={tx.id}>
                      <td style={{ fontWeight: 600 }}>{tx.bookTitle}</td>
                      <td>{tx.issueDate}</td>
                      <td>{tx.dueDate}</td>
                      <td style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{tx.returnDate}</td>
                      <td>
                        {tx.fineAmount > 0 ? (
                          <span style={{ color: 'var(--accent-red)', fontWeight: 600 }}>₹{tx.fineAmount.toFixed(2)}</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>₹0.00</span>
                        )}
                      </td>
                      <td>
                        <span className="badge indigo">Returned</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Reservation Statuses */}
      <div className="glass-card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'Outfit, sans-serif' }}>
          <Calendar size={18} style={{ color: 'var(--accent-indigo)' }} /> My Book Reservations
        </h2>
        {studentReservations.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <p className="empty-state-desc">You have no active or historical reservations.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Request Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {studentReservations.map(res => (
                  <tr key={res.id}>
                    <td style={{ fontWeight: 600 }}>{res.bookTitle}</td>
                    <td>{res.requestDate}</td>
                    <td>
                      <span className={`badge ${
                        res.status === 'approved' ? 'green' : 
                        res.status === 'rejected' ? 'red' : 'orange'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
