import React, { useContext, useState } from 'react';
import { LibraryContext } from '../../context/LibraryContext';
import { Settings2, Save, RotateCcw, CheckCircle2 } from 'lucide-react';

export const LibrarySettings = () => {
  const { settings, updateSettings } = useContext(LibraryContext);

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
    if (window.confirm("Reset all settings back to standard defaults?")) {
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
        <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.25rem', fontFamily: 'Outfit, sans-serif' }}>
          Library Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Configure overdue fee rates, borrowing limits, and loan duration periods.</p>
      </div>

      <div style={{ maxWidth: '640px' }}>
        <div className="glass-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>
            <Settings2 size={20} style={{ color: 'var(--accent-purple)' }} /> Circulation Rules
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
                <span>Max Concurrent Checkouts per Student</span>
                <span style={{ color: 'var(--accent-green)', fontWeight: 800 }}>{maxBooksPerStudent} Books</span>
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
                Maximum number of active borrowed books allowed per student.
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
                style={{ flex: 2 }}
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 size={16} /> Saved!
                  </>
                ) : (
                  <>
                    <Save size={16} /> Save Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LibrarySettings;
