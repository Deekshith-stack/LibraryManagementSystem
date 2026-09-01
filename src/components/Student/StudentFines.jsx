import React, { useContext, useState } from 'react';
import { LibraryContext } from '../../context/LibraryContext';
import { Modal } from '../Shared/Modal';
import { DollarSign, CheckCircle2, AlertTriangle, ShieldCheck, History } from 'lucide-react';

export const StudentFines = () => {
  const { currentUser, transactions, payFine, updateUser, paymentRecords } = useContext(LibraryContext);
  const [finesTab, setFinesTab] = useState('unpaid'); // 'unpaid' | 'history'
  
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const studentTxs = transactions.filter(t => t.studentId === currentUser.id);
  const unpaidTxs = studentTxs.filter(t => t.fineAmount > 0);
  const totalFine = unpaidTxs.reduce((sum, tx) => sum + tx.fineAmount, 0);

  // Student specific payment history
  const studentPayments = paymentRecords.filter(p => p.studentId === currentUser.id);

  const handleOpenPayModal = (tx) => {
    setSelectedTx(tx);
    setIsPayModalOpen(true);
    setPaymentSuccess(false);
  };

  const handlePaySubmit = (e) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvv) return;

    // Simulate payment process
    setTimeout(() => {
      if (selectedTx === 'all') {
        unpaidTxs.forEach(tx => payFine(tx.id));
      } else {
        payFine(selectedTx.id);
      }

      // Check if student status should be reactivated
      const updatedFines = selectedTx === 'all' ? 0 : totalFine - selectedTx.fineAmount;
      if (updatedFines === 0 && currentUser.status === 'suspended') {
        updateUser({
          ...currentUser,
          status: 'active'
        });
      }

      setPaymentSuccess(true);
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');
      setTimeout(() => {
        setIsPayModalOpen(false);
        setPaymentSuccess(false);
      }, 1500);
    }, 800);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Fines & Payments</h1>
        <p style={{ color: 'var(--text-secondary)' }}>View outstanding library fines and complete mock credit card checkout.</p>
      </div>

      {/* Tabs */}
      <div className="tabs-header" style={{ marginBottom: '1.5rem' }}>
        <button 
          className={`tab-btn ${finesTab === 'unpaid' ? 'active' : ''}`}
          onClick={() => setFinesTab('unpaid')}
        >
          Outstanding Fines (${totalFine.toFixed(2)})
        </button>
        <button 
          className={`tab-btn ${finesTab === 'history' ? 'active' : ''}`}
          onClick={() => setFinesTab('history')}
        >
          <History size={14} style={{ marginRight: '0.3rem' }} /> Payment Receipts History ({studentPayments.length})
        </button>
      </div>

      {finesTab === 'unpaid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
          {/* Fine summary card */}
          <div>
            <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Balance Due</span>
                  <span className={`badge ${totalFine > 0 ? 'red' : 'green'}`} style={{ marginLeft: 'auto' }}>
                    {totalFine > 0 ? 'Outstanding' : 'No Fines'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--text-muted)' }}>$</span>
                  <span style={{ fontSize: '3rem', fontWeight: 800, color: totalFine > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                    {totalFine.toFixed(2)}
                  </span>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '1.5rem' }}>
                  {totalFine > 0 
                    ? "Accumulated fines from overdue return items. Please complete payment to avoid library checkout suspension."
                    : "Excellent! You don't have any outstanding fines on your account."
                  }
                </p>
              </div>

              {totalFine > 0 && (
                <button 
                  className="btn-premium primary" 
                  style={{ width: '100%' }}
                  onClick={() => handleOpenPayModal('all')}
                >
                  <DollarSign size={18} /> Pay Total Balance
                </button>
              )}
            </div>
          </div>

          {/* Detailed Fine Table */}
          <div className="glass-card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Itemized Fines</h2>
            
            {unpaidTxs.length === 0 ? (
              <div className="empty-state" style={{ padding: '3rem 1.5rem' }}>
                <CheckCircle2 size={40} className="empty-state-icon" style={{ color: 'var(--accent-green)' }} />
                <h3 className="empty-state-title">No Fine Records</h3>
                <p className="empty-state-desc">You are in good standing. No unpaid transaction logs found.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Book Title</th>
                      <th>Due Date</th>
                      <th>Days Overdue</th>
                      <th>Fine Amt</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unpaidTxs.map(tx => {
                      const today = new Date().toISOString().split('T')[0];
                      const due = new Date(tx.dueDate);
                      const now = new Date(tx.returnDate || today);
                      const diffDays = Math.ceil(Math.max(0, now - due) / (1000 * 60 * 60 * 24));
                      
                      return (
                        <tr key={tx.id}>
                          <td style={{ fontWeight: 600 }}>{tx.bookTitle}</td>
                          <td>{tx.dueDate}</td>
                          <td style={{ color: 'var(--accent-red)' }}>{diffDays} days</td>
                          <td style={{ fontWeight: 600, color: 'var(--accent-red)' }}>${tx.fineAmount.toFixed(2)}</td>
                          <td>
                            <button 
                              className="btn-premium primary" 
                              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '6px' }}
                              onClick={() => handleOpenPayModal(tx)}
                            >
                              Pay
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Payment receipts history */
        <div className="glass-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Paid Receipts Log</h2>
          
          {studentPayments.length === 0 ? (
            <div className="empty-state" style={{ padding: '3.5rem 1.5rem' }}>
              <History size={40} className="empty-state-icon" />
              <h3 className="empty-state-title">No Payments Recorded</h3>
              <p className="empty-state-desc">You haven't made any fine payments yet.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Receipt ID</th>
                    <th>Book Title</th>
                    <th>Payment Date</th>
                    <th>Amount Paid</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentPayments.map(pay => (
                    <tr key={pay.id}>
                      <td><code>{pay.id.substring(4, 12)}</code></td>
                      <td style={{ fontWeight: 600 }}>{pay.bookTitle}</td>
                      <td>{pay.date}</td>
                      <td style={{ fontWeight: 700, color: 'var(--accent-green)' }}>${pay.amountPaid.toFixed(2)}</td>
                      <td>
                        <span className="badge green" style={{ fontSize: '0.65rem' }}>
                          CC_APPROVED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Pay Fine Simulation Modal */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title={selectedTx === 'all' ? 'Pay Total Library Fine' : 'Pay Book Fine'}
      >
        {paymentSuccess ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }} className="animate-fade-in">
            <CheckCircle2 size={48} style={{ color: 'var(--accent-green)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Payment Successful!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Mock transaction approved. Fine balance cleared.</p>
          </div>
        ) : (
          <form onSubmit={handlePaySubmit}>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Payment For:</span>
                <span style={{ fontWeight: 600 }}>{selectedTx === 'all' ? 'All Unpaid Fines' : selectedTx?.bookTitle}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 700 }}>
                <span>Amount:</span>
                <span style={{ color: 'var(--accent-red)' }}>
                  ${selectedTx === 'all' ? totalFine.toFixed(2) : selectedTx?.fineAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Cardholder Name</label>
              <input type="text" className="glass-input" defaultValue={currentUser.name} required />
            </div>

            <div className="form-group">
              <label className="form-label">Card Number</label>
              <input 
                type="text" 
                className="glass-input" 
                placeholder="4111 2222 3333 4444" 
                value={cardNumber} 
                onChange={(e) => setCardNumber(e.target.value)} 
                required 
              />
            </div>

            <div className="grid-gap-2">
              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  placeholder="MM/YY" 
                  value={cardExpiry} 
                  onChange={(e) => setCardExpiry(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">CVV</label>
                <input 
                  type="password" 
                  className="glass-input" 
                  placeholder="123" 
                  maxLength={3}
                  value={cardCvv} 
                  onChange={(e) => setCardCvv(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              <ShieldCheck size={14} style={{ color: 'var(--accent-green)' }} />
              <span>Simulated Payment Gateway. No real funds are transferred.</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn-premium secondary" onClick={() => setIsPayModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-premium primary">
                Submit Payment
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default StudentFines;
