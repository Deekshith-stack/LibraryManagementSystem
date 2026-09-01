import React, { useContext } from 'react';
import { LibraryContext } from '../../context/LibraryContext';
import { Bookmark, Check, X, AlertCircle } from 'lucide-react';

export const Reservations = () => {
  const { reservations, updateReservationStatus, books } = useContext(LibraryContext);

  const handleApprove = (res) => {
    const book = books.find(b => b.id === res.bookId);
    if (book && book.copiesAvailable <= 0) {
      alert("Error: Book is currently out of stock. Cannot approve reservation.");
      return;
    }
    try {
      updateReservationStatus(res.id, 'approved');
      alert(`Reservation approved! "${res.bookTitle}" has been checked out and issued to ${res.studentName}.`);
    } catch (err) {
      alert(`Approval failed: ${err.message}`);
    }
  };

  const handleReject = (resId) => {
    if (window.confirm("Are you sure you want to reject this student reservation request?")) {
      updateReservationStatus(resId, 'rejected');
    }
  };

  const pendingRes = reservations.filter(r => r.status === 'pending');
  const processedRes = reservations.filter(r => r.status !== 'pending');

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Reservations Queue</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review students' book reservation requests and approve holdings.</p>
      </div>

      {/* Pending Reservations Queue */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bookmark size={20} className="gradient-text" /> Pending Requests ({pendingRes.length})
        </h2>

        {pendingRes.length === 0 ? (
          <div className="empty-state" style={{ padding: '3rem 1.5rem' }}>
            <AlertCircle size={40} className="empty-state-icon" />
            <h3 className="empty-state-title">Queue is empty</h3>
            <p className="empty-state-desc">There are no pending student book reservations to review.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Requested Book</th>
                  <th>Request Date</th>
                  <th>Stock Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRes.map(res => {
                  const book = books.find(b => b.id === res.bookId);
                  const isAvailable = book && book.copiesAvailable > 0;
                  return (
                    <tr key={res.id}>
                      <td style={{ fontWeight: 600 }}>{res.studentName}</td>
                      <td style={{ fontWeight: 500 }}>{res.bookTitle}</td>
                      <td>{res.requestDate}</td>
                      <td>
                        <span className={`badge ${isAvailable ? 'green' : 'red'}`}>
                          {isAvailable ? `${book.copiesAvailable} In Stock` : 'Out of Stock'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button 
                            className="btn-premium success" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '6px' }}
                            onClick={() => handleApprove(res)}
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button 
                            className="btn-premium danger" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '6px' }}
                            onClick={() => handleReject(res.id)}
                          >
                            <X size={14} /> Reject
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

      {/* Processed History */}
      <div className="glass-card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Processed Requests Log</h2>

        {processedRes.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <p className="empty-state-desc">No reservation requests have been processed yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Requested Book</th>
                  <th>Request Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {processedRes.map(res => (
                  <tr key={res.id}>
                    <td>{res.studentName}</td>
                    <td style={{ fontWeight: 500 }}>{res.bookTitle}</td>
                    <td>{res.requestDate}</td>
                    <td>
                      <span className={`badge ${res.status === 'approved' ? 'green' : 'red'}`}>
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

export default Reservations;
