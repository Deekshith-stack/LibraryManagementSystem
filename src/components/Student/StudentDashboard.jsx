import React, { useContext, useState } from 'react';
import { LibraryContext } from '../../context/LibraryContext';
import { BookOpen, Calendar, AlertTriangle, CheckCircle2, History, Award } from 'lucide-react';

export const StudentDashboard = () => {
  const { currentUser, transactions, reservations, books } = useContext(LibraryContext);
  const [dashboardTab, setDashboardTab] = useState('active'); // 'active' | 'history'

  // Filter student transactions
  const studentTxs = transactions.filter(t => t.studentId === currentUser.id);
  const activeTxs = studentTxs.filter(t => !t.returnDate);
  const historyTxs = studentTxs.filter(t => t.returnDate);
  const overdueTxs = activeTxs.filter(t => t.status === 'overdue');
  const studentReservations = reservations.filter(r => r.studentId === currentUser.id);

  // Statistics calculation
  const totalIssued = activeTxs.length;
  const overdueCount = overdueTxs.length;
  const pendingReservations = studentReservations.filter(r => r.status === 'pending').length;
  const totalFines = activeTxs.reduce((sum, tx) => sum + tx.fineAmount, 0);

  // Dynamic Favorite Category computation
  const getFavoriteCategory = () => {
    if (studentTxs.length === 0) return 'None';
    
    const catCounts = {};
    studentTxs.forEach(tx => {
      const bookObj = books.find(b => b.id === tx.bookId);
      if (bookObj) {
        catCounts[bookObj.category] = (catCounts[bookObj.category] || 0) + 1;
      }
    });

    const sorted = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : 'None';
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
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>
          Welcome back, {currentUser.name}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Enrollment ID: <code style={{ color: 'var(--accent-cyan)' }}>{currentUser.enrollmentId}</code> | Account Status: 
          <span className={`badge ${currentUser.status === 'active' ? 'green' : 'red'}`} style={{ marginLeft: '0.5rem' }}>
            {currentUser.status}
          </span>
        </p>
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
            <span className="stat-value" style={{ fontSize: '1.25rem', fontWeight: 800, padding: '0.25rem 0' }}>
              {favoriteGenre.length > 18 ? `${favoriteGenre.substring(0, 15)}...` : favoriteGenre}
            </span>
            <span className="stat-title">Fav Genre</span>
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
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>$</span>
          </div>
          <div className="stat-details">
            <span className="stat-value">${totalFines.toFixed(2)}</span>
            <span className="stat-title">Outstanding Fines</span>
          </div>
        </div>
      </div>

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
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={20} className="gradient-text" /> Current Borrowings
          </h2>

          {activeTxs.length === 0 ? (
            <div className="empty-state">
              <CheckCircle2 className="empty-state-icon" style={{ color: 'var(--accent-green)' }} />
              <h3 className="empty-state-title">All Clear!</h3>
              <p className="empty-state-desc">You don't have any books currently checked out.</p>
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
                            <span style={{ color: 'var(--accent-red)', fontWeight: 600 }}>
                              {Math.abs(daysLeft)} days overdue
                            </span>
                          ) : (
                            <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>
                              {daysLeft} days left
                            </span>
                          )}
                        </td>
                        <td style={{ color: tx.fineAmount > 0 ? 'var(--accent-red)' : 'var(--text-primary)', fontWeight: tx.fineAmount > 0 ? 600 : 400 }}>
                          ${tx.fineAmount.toFixed(2)}
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
        /* Reading history tab */
        <div className="glass-card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <History size={20} className="gradient-text" /> Returned Books Records
          </h2>

          {historyTxs.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-desc">You have not completed any check-ins yet.</p>
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
                          <span style={{ color: 'var(--accent-red)', fontWeight: 600 }}>${tx.fineAmount.toFixed(2)}</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>$0.00</span>
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
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
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
