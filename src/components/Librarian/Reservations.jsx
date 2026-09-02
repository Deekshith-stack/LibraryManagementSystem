import React, { useContext } from 'react';
import { LibraryContext } from '../../context/LibraryContext';
import { Check, X, Clock, CheckCircle2 } from 'lucide-react';

export const Reservations = () => {
  const { reservations, books, approveReservation, rejectReservation } = useContext(LibraryContext);

  const pendingReservations = (reservations || []).filter(r => r.status === 'pending');
  const processedReservations = (reservations || []).filter(r => r.status !== 'pending');

  const getBookStock = (bookId) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.copiesAvailable : 0;
  };

  const handleApprove = (reservationId) => {
    approveReservation(reservationId);
    alert("Hold request approved successfully!");
  };

  const handleReject = (reservationId) => {
    if (window.confirm("Reject this book reservation request?")) {
      rejectReservation(reservationId);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.25rem', fontFamily: 'Outfit, sans-serif' }}>
          Hold & Reservation Queue
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review pending student hold requests, approve book pickups, and manage history.</p>
      </div>

      {/* Pending Reservations Queue */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>
          <Clock size={20} style={{ color: 'var(--accent-green)' }} /> Pending Hold Requests ({pendingReservations.length})
        </h2>

        {pendingReservations.length === 0 ? (
          <div className="empty-state">
            <CheckCircle2 size={40} className="empty-state-icon" style={{ color: 'var(--accent-green)' }} />
            <h3 className="empty-state-title">Hold Queue is Clear</h3>
            <p className="empty-state-desc">No student reservation requests are pending approval.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Requested Book</th>
                  <th>Request Date</th>
                  <th>Current Stock</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingReservations.map(res => {
                  const stock = getBookStock(res.bookId);
                  const isAvailable = stock > 0;

                  return (
                    <tr key={res.id}>
                      <td>
                        <div style={{ fontWeight: 700 }}>{res.studentName}</div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{res.bookTitle}</td>
                      <td>{res.requestDate}</td>
                      <td>
                        <span className={`badge ${isAvailable ? 'green' : 'red'}`} style={{ fontSize: '0.725rem' }}>
                          {isAvailable ? `${stock} Available` : 'Out of Stock'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button
                            className="btn-premium success"
                            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: '8px' }}
                            title="Approve Hold"
                            onClick={() => handleApprove(res.id)}
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button
                            className="btn-premium danger"
                            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: '8px' }}
                            title="Reject Hold"
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

      {/* Processed Archive */}
      <div className="glass-card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', fontFamily: 'Outfit, sans-serif' }}>
          Historical Request Logs ({processedReservations.length})
        </h2>

        {processedReservations.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-desc">No historical reservations processed yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Book Title</th>
                  <th>Request Date</th>
                  <th>Decision Status</th>
                </tr>
              </thead>
              <tbody>
                {processedReservations.map(res => (
                  <tr key={res.id}>
                    <td style={{ fontWeight: 600 }}>{res.studentName}</td>
                    <td style={{ fontWeight: 600 }}>{res.bookTitle}</td>
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
