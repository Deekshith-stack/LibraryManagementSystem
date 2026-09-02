import React, { useContext, useState } from 'react';
import { LibraryContext } from '../../context/LibraryContext';
import { Settings2, Save, RotateCcw, AlertTriangle, ShieldCheck, Download, Upload, CheckCircle2 } from 'lucide-react';

export const LibrarySettings = () => {
  const { settings, updateSettings, exportDataAsCSV } = useContext(LibraryContext);

  const [fineRatePerDay, setFineRatePerDay] = useState(settings.fineRatePerDay || 5.0);
  const [borrowPeriodDays, setBorrowPeriodDays] = useState(settings.borrowPeriodDays || 14);
  const [maxBooksPerStudent, setMaxBooksPerStudent] = useState(settings.maxBooksPerStudent || 4);

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings({
      fineRatePerDay: parseFloat(fineRatePerDay) || 5.0,
      borrowPeriodDays: parseInt(borrowPeriodDays) || 14,
      maxBooksPerStudent: parseInt(maxBooksPerStudent) || 4
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  const handleResetDefaults = () => {
    if (window.confirm("Reset all lending policies back to standard Lumina defaults?")) {
      setFineRatePerDay(5.0);
      setBorrowPeriodDays(14);
      setMaxBooksPerStudent(4);
      updateSettings({
        fineRatePerDay: 5.0,
        borrowPeriodDays: 14,
        maxBooksPerStudent: 4
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="gradient-text-apex" style={{ fontSize: '2rem', marginBottom: '0.25rem', fontFamily: 'Outfit, sans-serif' }}>
          Circulation Policy & Engine Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Configure overdue fee evaluation rates, lending limits, and system backup archives.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Core Rules Configuration */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>
            <Settings2 size={20} className="gradient-text-apex" /> Circulation Rules Engine
          </h2>

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Overdue Fine Rate per Day (₹)</span>
                <span style={{ color: 'var(--accent-purple)', fontWeight: 800 }}>₹{parseFloat(fineRatePerDay).toFixed(2)}/day</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                className="glass-input"
                value={fineRatePerDay}
                onChange={(e) => setFineRatePerDay(e.target.value)}
                required
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Assessed on active checkouts past the designated due date.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Default Loan Duration (Days)</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 800 }}>{borrowPeriodDays} Days</span>
              </label>
              <input
                type="number"
                min="1"
                max="90"
                className="glass-input"
                value={borrowPeriodDays}
                onChange={(e) => setBorrowPeriodDays(e.target.value)}
                required
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Standard checkout window applied to newly issued books.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Max Concurrent Checkouts per Scholar</span>
                <span style={{ color: 'var(--accent-green)', fontWeight: 800 }}>{maxBooksPerStudent} Volumes</span>
              </label>
              <input
                type="number"
                min="1"
                max="20"
                className="glass-input"
                value={maxBooksPerStudent}
                onChange={(e) => setMaxBooksPerStudent(e.target.value)}
                required
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Threshold limit preventing excessive simultaneous checkouts.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
              <button
                type="button"
                className="btn-premium secondary"
                style={{ flex: 1 }}
                onClick={handleResetDefaults}
              >
                <RotateCcw size={16} /> Defaults
              </button>
              <button
                type="submit"
                className="btn-premium primary"
                style={{ flex: 2, background: 'var(--gradient-apex)' }}
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 size={16} /> Saved!
                  </>
                ) : (
                  <>
                    <Save size={16} /> Save Policies
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* System Operations & Backups */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>
            <ShieldCheck size={20} style={{ color: 'var(--accent-green)' }} /> Database Archives & Telemetry
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>Lumina Inventory Export</div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Download real-time snapshot of the entire book catalog as formatted CSV.
              </p>
              <button 
                className="btn-premium secondary" 
                style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}
                onClick={() => exportDataAsCSV('books')}
              >
                <Download size={14} /> Export Books Catalog CSV
              </button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>Circulation Transactions Export</div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Archive all active loans, return dates, and fine payments as CSV.
              </p>
              <button 
                className="btn-premium secondary" 
                style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}
                onClick={() => exportDataAsCSV('transactions')}
              >
                <Download size={14} /> Export Lending Logs CSV
              </button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>Patron Directory Export</div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Export member profiles, credentials, and access status records.
              </p>
              <button 
                className="btn-premium secondary" 
                style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}
                onClick={() => exportDataAsCSV('users')}
              >
                <Download size={14} /> Export Patrons CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibrarySettings;
