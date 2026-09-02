import React, { useContext, useState } from 'react';
import { LibraryContext } from '../../context/LibraryContext';
import { ArrowLeftRight, CheckCircle2, AlertTriangle, Calendar, Plus, User, Mail, RefreshCw } from 'lucide-react';
import { Modal } from '../Shared/Modal';

export const IssueReturn = () => {
  const {
    transactions,
    books,
    users,
    settings,
    issueBook,
    returnBook,
    renewLoan,
    sendOverdueReminder
  } = useContext(LibraryContext);

  const [activeTab, setActiveTab] = useState('active-loans'); // 'active-loans' | 'return-history'
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [overdueOnly, setOverdueOnly] = useState(false);

  // Form states
  const [studentId, setStudentId] = useState('');
  const [bookId, setBookId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filter students and books
  const activeStudents = (users || []).filter(u => u.role === 'student' && u.status === 'active');
  const availableBooks = (books || []).filter(b => b.copiesAvailable > 0);

  const activeTxs = (transactions || []).filter(t => !t.returnDate);
  const filteredActiveTxs = activeTxs.filter(tx => {
    return !overdueOnly || tx.status === 'overdue';
  });

  const historyTxs = (transactions || []).filter(t => t.returnDate);

  const handleOpenIssue = () => {
    setStudentId(activeStudents[0]?.id || '');
    setBookId(availableBooks[0]?.id || '');

    // Default due date
    const d = new Date();
    d.setDate(d.getDate() + settings.borrowPeriodDays);
    setDueDate(d.toISOString().split('T')[0]);

    setErrorMsg('');
    setSuccessMsg('');
    setIsIssueModalOpen(true);
  };

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (!studentId || !bookId || !dueDate) return;

    try {
      issueBook(studentId, bookId, dueDate);
      setSuccessMsg("Book issued successfully!");
      setTimeout(() => {
        setIsIssueModalOpen(false);
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || "Failed to issue book.");
    }
  };

  const handleReturn = (txId) => {
    if (window.confirm("Complete book return process?")) {
      returnBook(txId);
    }
  };

  const handleRenew = (txId) => {
    renewLoan(txId);
    alert("Book checkout renewed successfully! Due date extended by 7 days.");
  };

  const handleSendNotice = (txId) => {
    sendOverdueReminder(txId);
    alert("Overdue notice alert email sent to student successfully.");
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Issue & Return Desk</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Check books in and out, track deadlines, and monitor overdue loans.</p>
        </div>

        <button className="btn-premium primary" onClick={handleOpenIssue}>
          <Plus size={18} /> Issue Book
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === 'active-loans' ? 'active' : ''}`}
          onClick={() => setActiveTab('active-loans')}
        >
          Active Loans ({activeTxs.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'return-history' ? 'active' : ''}`}
          onClick={() => setActiveTab('return-history')}
        >
          Return History ({historyTxs.length})
        </button>
      </div>

      {activeTab === 'active-loans' ? (
        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 0 }}>
              <ArrowLeftRight size={20} className="gradient-text" /> Outstanding Loans
            </h2>

            <label className="flex-align" style={{ gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={overdueOnly}
                onChange={(e) => setOverdueOnly(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <span>Filter Overdue Only</span>
            </label>
          </div>

          {filteredActiveTxs.length === 0 ? (
            <div className="empty-state">
              <CheckCircle2 size={40} className="empty-state-icon" style={{ color: 'var(--accent-green)' }} />
              <h3 className="empty-state-title">No Loans Found</h3>
              <p className="empty-state-desc">No active borrow transaction logs match the selected filters.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Borrower</th>
                    <th>Book Title</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Accrued Fine</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActiveTxs.map(tx => {
                    const isOverdue = tx.status === 'overdue';
                    return (
                      <tr key={tx.id}>
                        <td>
                          <div>
                            <div style={{ fontWeight: 600 }}>{tx.studentName}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID: {tx.studentId.substring(5, 13)}</div>
                          </div>
                        </td>
                        <td style={{ fontWeight: 600 }}>{tx.bookTitle}</td>
                        <td>{tx.issueDate}</td>
                        <td>{tx.dueDate}</td>
                        <td style={{ color: tx.fineAmount > 0 ? 'var(--accent-red)' : 'inherit', fontWeight: tx.fineAmount > 0 ? 600 : 400 }}>
                          ₹{tx.fineAmount.toFixed(2)}
                        </td>
                        <td>
                          <span className={`badge ${isOverdue ? 'red' : 'green'}`}>
                            {isOverdue ? 'overdue' : 'active'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                            {isOverdue && (
                              <button
                                className="btn-premium secondary"
                                style={{ padding: '0.4rem', borderRadius: '6px' }}
                                title="Send Overdue Reminder"
                                onClick={() => handleSendNotice(tx.id)}
                              >
                                <Mail size={14} style={{ color: 'var(--accent-orange)' }} />
                              </button>
                            )}
                            <button
                              className="btn-premium secondary"
                              style={{ padding: '0.4rem', borderRadius: '6px' }}
                              title="Renew Loan (Extend 7 Days)"
                              onClick={() => handleRenew(tx.id)}
                            >
                              <RefreshCw size={14} style={{ color: 'var(--accent-cyan)' }} />
                            </button>
                            <button
                              className="btn-premium success"
                              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '6px' }}
                              onClick={() => handleReturn(tx.id)}
                            >
                              Check In
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
      ) : (
        <div className="glass-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Transaction History Log</h2>

          {historyTxs.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-desc">No books have been checked in yet during this session.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Borrower</th>
                    <th>Book Title</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Return Date</th>
                    <th>Fine Paid</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {historyTxs.map(tx => (
                    <tr key={tx.id}>
                      <td>
                        <div>
                          <div style={{ fontWeight: 500 }}>{tx.studentName}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID: {tx.studentId.substring(5, 13)}</div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 500 }}>{tx.bookTitle}</td>
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

      {/* Issue Book Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Issue Book to Student"
      >
        <form onSubmit={handleIssueSubmit}>
          {errorMsg && (
            <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-green)', color: 'var(--accent-green)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Select Student Profile</label>
            {activeStudents.length === 0 ? (
              <p style={{ color: 'var(--accent-red)', fontSize: '0.85rem' }}>No active/un-suspended students found in Directory.</p>
            ) : (
              <select
                className="glass-input glass-select"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              >
                <option value="" disabled>-- Select Student --</option>
                {activeStudents.map(stu => (
                  <option key={stu.id} value={stu.id}>{stu.name} ({stu.enrollmentId})</option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Select Book Title</label>
            {availableBooks.length === 0 ? (
              <p style={{ color: 'var(--accent-red)', fontSize: '0.85rem' }}>No available books in stock.</p>
            ) : (
              <select
                className="glass-input glass-select"
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                required
              >
                <option value="" disabled>-- Select Book --</option>
                {availableBooks.map(b => (
                  <option key={b.id} value={b.id}>{b.title} by {b.author} ({b.copiesAvailable} left)</option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Return Due Date</label>
            <div style={{ position: 'relative' }}>
              <input
                type="date"
                className="glass-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              * Default borrow period is {settings.borrowPeriodDays} days.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn-premium secondary" onClick={() => setIsIssueModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-premium primary" disabled={activeStudents.length === 0 || availableBooks.length === 0}>
              Complete Checkout
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default IssueReturn;
