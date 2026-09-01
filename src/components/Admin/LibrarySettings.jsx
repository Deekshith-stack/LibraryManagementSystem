import React, { useContext, useState } from 'react';
import { LibraryContext } from '../../context/LibraryContext';
import { Settings2, Save, Sparkles, CheckCircle2 } from 'lucide-react';

export const LibrarySettings = () => {
  const { settings, updateSettings } = useContext(LibraryContext);

  const [fineRatePerDay, setFineRatePerDay] = useState(settings.fineRatePerDay);
  const [maxBooksAllowed, setMaxBooksAllowed] = useState(settings.maxBooksAllowed);
  const [borrowPeriodDays, setBorrowPeriodDays] = useState(settings.borrowPeriodDays);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings({
      fineRatePerDay,
      maxBooksAllowed,
      borrowPeriodDays
    });
    
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 2000);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Library Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Configure global library parameters, lending policies, and fine rate adjustments.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Settings form */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings2 size={20} className="gradient-text" /> Circulation Rules Configuration
          </h2>

          <form onSubmit={handleSubmit}>
            {success && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-green)', color: 'var(--accent-green)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} />
                <span>Global library lending rules updated successfully!</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Overdue Fine Rate ($ per day)</label>
              <input 
                type="number" 
                step="0.05"
                min="0"
                className="glass-input"
                value={fineRatePerDay}
                onChange={(e) => setFineRatePerDay(parseFloat(e.target.value) || 0)}
                required
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Amount charged to students per day for each unreturned overdue book.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Max Allowed Books per Student</label>
              <input 
                type="number" 
                min="1"
                className="glass-input"
                value={maxBooksAllowed}
                onChange={(e) => setMaxBooksAllowed(parseInt(e.target.value) || 1)}
                required
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Maximum number of active checked-out books a student can hold simultaneously.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Standard Borrow Period (Days)</label>
              <input 
                type="number" 
                min="1"
                className="glass-input"
                value={borrowPeriodDays}
                onChange={(e) => setBorrowPeriodDays(parseInt(e.target.value) || 1)}
                required
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Standard count of days allowed for lending out books before marking as overdue.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button type="submit" className="btn-premium primary">
                <Save size={16} /> Apply lending rules
              </button>
            </div>
          </form>
        </div>

        {/* Info panel */}
        <div>
          <div className="glass-card" style={{ height: '100%' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} style={{ color: 'var(--accent-purple)' }} />
              Active Guidelines
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem', marginTop: '1.5rem' }}>
              <div>
                <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Daily Fine Fee</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>${settings.fineRatePerDay.toFixed(2)}</span>
              </div>
              
              <div>
                <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Lending Limit</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-indigo)' }}>{settings.maxBooksAllowed} Books</span>
              </div>

              <div>
                <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Lending Duration</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-purple)' }}>{settings.borrowPeriodDays} Days</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LibrarySettings;
