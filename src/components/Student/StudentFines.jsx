import React, { useContext, useState } from 'react';
import { LibraryContext } from '../../context/LibraryContext';
import { Modal } from '../Shared/Modal';
import { CheckCircle2, AlertTriangle, ShieldCheck, History, CreditCard, QrCode, ArrowRight, Download, Receipt } from 'lucide-react';

export const StudentFines = () => {
  const { currentUser, transactions, payFine, updateUser, paymentRecords } = useContext(LibraryContext);
  const [finesTab, setFinesTab] = useState('unpaid'); // 'unpaid' | 'history'
  
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'upi'
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');

  const studentTxs = (transactions || []).filter(t => t.studentId === currentUser?.id);
  const unpaidTxs = studentTxs.filter(t => t.fineAmount > 0);
  const totalFine = unpaidTxs.reduce((sum, tx) => sum + tx.fineAmount, 0);

  // Student specific payment history
  const studentPayments = (paymentRecords || []).filter(p => p.studentId === currentUser?.id);

  const handleOpenPayModal = (tx) => {
    setSelectedTx(tx);
    setIsPayModalOpen(true);
    setPaymentSuccess(false);
  };

  const handlePaySubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv)) return;
    if (paymentMethod === 'upi' && !upiId) return;

    setTimeout(() => {
      if (selectedTx === 'all') {
        unpaidTxs.forEach(tx => payFine(tx.id));
      } else {
        payFine(selectedTx.id);
      }

      // Reactivate student status if suspended
      const updatedFines = selectedTx === 'all' ? 0 : totalFine - selectedTx.fineAmount;
      if (updatedFines === 0 && currentUser?.status === 'suspended') {
        updateUser({
          ...currentUser,
          status: 'active'
        });
      }

      setPaymentSuccess(true);
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');
      setUpiId('');
      setTimeout(() => {
        setIsPayModalOpen(false);
        setPaymentSuccess(false);
      }, 1500);
    }, 800);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="gradient-text-scholar" style={{ fontSize: '2rem', marginBottom: '0.25rem', fontFamily: 'Outfit, sans-serif' }}>
          Circulation Fines & Receipts
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review outstanding overdue balances, manage simulated UPI / Card payments, and download receipts.</p>
      </div>

      {/* Tabs */}
      <div className="tabs-header" style={{ marginBottom: '1.5rem' }}>
        <button 
          className={`tab-btn ${finesTab === 'unpaid' ? 'active' : ''}`}
          onClick={() => setFinesTab('unpaid')}
        >
          Outstanding Fines (₹{totalFine.toFixed(2)})
        </button>
        <button 
          className={`tab-btn ${finesTab === 'history' ? 'active' : ''}`}
          onClick={() => setFinesTab('history')}
        >
          <Receipt size={14} style={{ marginRight: '0.3rem', display: 'inline' }} /> Payment Receipts History ({studentPayments.length})
        </button>
      </div>

      {finesTab === 'unpaid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
          {/* Fine summary card */}
          <div>
            <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.825rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>Balance Due</span>
                  <span className={`badge ${totalFine > 0 ? 'red' : 'green'}`} style={{ marginLeft: 'auto' }}>
                    {totalFine > 0 ? 'Outstanding' : 'No Fines'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-muted)' }}>₹</span>
                  <span style={{ fontSize: '3rem', fontWeight: 900, color: totalFine > 0 ? 'var(--accent-red)' : 'var(--accent-green)', fontFamily: 'Outfit, sans-serif' }}>
                    {totalFine.toFixed(2)}
                  </span>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '1.5rem' }}>
                  {totalFine > 0 
                    ? "Accrued overdue charges calculated according to institutional lending regulations. Clear dues to maintain active borrowing privileges."
                    : "Outstanding balance is zero. Your account is in pristine standing."
                  }
                </p>
              </div>

              {totalFine > 0 && (
                <button 
                  className="btn-premium primary" 
                  style={{ width: '100%', padding: '0.85rem' }}
                  onClick={() => handleOpenPayModal('all')}
                >
                  Pay Outstanding Total (₹{totalFine.toFixed(2)}) <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Detailed Fine Table */}
          <div className="glass-card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', fontFamily: 'Outfit, sans-serif' }}>Itemized Overdue Accounts</h2>
            
            {unpaidTxs.length === 0 ? (
              <div className="empty-state" style={{ padding: '3.5rem 1.5rem' }}>
                <CheckCircle2 size={44} className="empty-state-icon" style={{ color: 'var(--accent-green)' }} />
                <h3 className="empty-state-title">No Unpaid Dues</h3>
                <p className="empty-state-desc">You have no accrued fines pending in the circulation database.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Book Title</th>
                      <th>Due Date</th>
                      <th>Days Overdue</th>
                      <th>Fine Assessed</th>
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
                          <td style={{ color: 'var(--accent-red)', fontWeight: 700 }}>{diffDays} days</td>
                          <td style={{ fontWeight: 800, color: 'var(--accent-red)' }}>₹{tx.fineAmount.toFixed(2)}</td>
                          <td>
                            <button 
                              className="btn-premium primary" 
                              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: '8px' }}
                              onClick={() => handleOpenPayModal(tx)}
                            >
                              Pay Now
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', fontFamily: 'Outfit, sans-serif' }}>Receipts Archive</h2>
          
          {studentPayments.length === 0 ? (
            <div className="empty-state" style={{ padding: '3.5rem 1.5rem' }}>
              <History size={40} className="empty-state-icon" />
              <h3 className="empty-state-title">No Prior Transactions</h3>
              <p className="empty-state-desc">Your payment receipt logs will appear here upon completion of checkout.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Receipt Code</th>
                    <th>Book Title</th>
                    <th>Date Paid</th>
                    <th>Amount Cleared</th>
                    <th>Verification</th>
                  </tr>
                </thead>
                <tbody>
                  {studentPayments.map(pay => (
                    <tr key={pay.id}>
                      <td><code>#{pay.id.substring(4, 12).toUpperCase()}</code></td>
                      <td style={{ fontWeight: 600 }}>{pay.bookTitle}</td>
                      <td>{pay.date}</td>
                      <td style={{ fontWeight: 800, color: 'var(--accent-green)' }}>₹{pay.amountPaid.toFixed(2)}</td>
                      <td>
                        <span className="badge green" style={{ fontSize: '0.65rem' }}>
                          SETTLED
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

      {/* Pay Fine Modal */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title={selectedTx === 'all' ? 'Lumina Settlement Gateway' : 'Fine Payment Portal'}
      >
        {paymentSuccess ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }} className="animate-fade-in">
            <CheckCircle2 size={52} style={{ color: 'var(--accent-green)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>Payment Approved!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Receipt generated and circulation record updated instantly.</p>
          </div>
        ) : (
          <form onSubmit={handlePaySubmit}>
            {/* Payment method selector */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <button
                type="button"
                className={`tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', border: '1px solid var(--border-color)', background: paymentMethod === 'card' ? 'rgba(6,182,212,0.15)' : 'transparent' }}
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard size={16} /> Credit / Debit Card
              </button>
              <button
                type="button"
                className={`tab-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', border: '1px solid var(--border-color)', background: paymentMethod === 'upi' ? 'rgba(6,182,212,0.15)' : 'transparent' }}
                onClick={() => setPaymentMethod('upi')}
              >
                <QrCode size={16} /> UPI / QR Payment
              </button>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Item:</span>
                <span style={{ fontWeight: 600 }}>{selectedTx === 'all' ? 'All Unpaid Fines' : selectedTx?.bookTitle}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800 }}>
                <span>Total Amount:</span>
                <span style={{ color: 'var(--accent-red)' }}>
                  ₹{selectedTx === 'all' ? totalFine.toFixed(2) : selectedTx?.fineAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {paymentMethod === 'card' ? (
              <>
                <div className="form-group">
                  <label className="form-label">Payer Name</label>
                  <input type="text" className="glass-input" defaultValue={currentUser?.name} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input 
                    type="text" 
                    className="glass-input" 
                    placeholder="4111 •••• •••• 4444" 
                    value={cardNumber} 
                    onChange={(e) => setCardNumber(e.target.value)} 
                    required 
                  />
                </div>

                <div className="grid-gap-2">
                  <div className="form-group">
                    <label className="form-label">Expiry</label>
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
                      maxLength={4}
                      value={cardCvv} 
                      onChange={(e) => setCardCvv(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="form-group">
                <label className="form-label">Enter UPI ID / VPA</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  placeholder="scholar@okhdfcbank or user@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  required
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                  Simulated UPI transaction. Auto-confirms upon submission.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              <ShieldCheck size={14} style={{ color: 'var(--accent-green)' }} />
              <span>Simulated Payment Gateway. 256-Bit SSL Encrypted Sandbox.</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn-premium secondary" onClick={() => setIsPayModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-premium primary">
                Confirm ₹{selectedTx === 'all' ? totalFine.toFixed(2) : selectedTx?.fineAmount.toFixed(2)}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default StudentFines;
