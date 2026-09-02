import React, { useContext } from 'react';
import { LibraryContext } from '../../context/LibraryContext';
import { 
  BookOpen, 
  Users, 
  ArrowLeftRight, 
  DollarSign, 
  Download, 
  Activity, 
  TrendingUp, 
  Layers, 
  ShieldCheck, 
  Zap,
  Clock
} from 'lucide-react';

export const Dashboard = () => {
  const { books, users, transactions, activityLogs, exportDataAsCSV } = useContext(LibraryContext);

  // Dynamic system analytics
  const totalBooks = (books || []).reduce((sum, b) => sum + b.totalCopies, 0);
  const totalTitles = (books || []).length;
  const totalUsers = (users || []).length;
  
  const activeLoans = (transactions || []).filter(t => !t.returnDate).length;
  const overdueLoans = (transactions || []).filter(t => !t.returnDate && t.status === 'overdue').length;
  const totalFinesCollected = (transactions || []).reduce((sum, t) => sum + (t.returnDate ? t.fineAmount : 0), 0);

  // Category distribution
  const categoryStats = {};
  (books || []).forEach(b => {
    categoryStats[b.category] = (categoryStats[b.category] || 0) + b.totalCopies;
  });

  const categoryEntries = Object.entries(categoryStats);

  // Most Popular Books
  const bookBorrowCounts = {};
  (transactions || []).forEach(t => {
    bookBorrowCounts[t.bookTitle] = (bookBorrowCounts[t.bookTitle] || 0) + 1;
  });

  const popularBooks = Object.entries(bookBorrowCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Lumina Apex Identity Banner */}
      <div className="portal-banner apex">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge purple" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
              LUMINA APEX EXECUTIVE CONSOLE
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              • System Telemetry: <code style={{ color: 'var(--accent-purple)' }}>Online / Operational</code>
            </span>
          </div>
          <h1 className="gradient-text-apex" style={{ fontSize: '2.25rem', marginBottom: '0.35rem', lineHeight: 1.15 }}>
            Apex Operations & Intelligence
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', maxWidth: '600px' }}>
            Executive oversight of catalog volume, patron demographics, active lending velocity, and audit streams.
          </p>
        </div>

        {/* Quick CSV Export Suite */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            className="btn-premium primary" 
            style={{ background: 'var(--gradient-apex)', padding: '0.65rem 1rem', fontSize: '0.85rem' }}
            onClick={() => exportDataAsCSV('books')}
          >
            <Download size={15} /> Books CSV
          </button>
          <button 
            className="btn-premium secondary" 
            style={{ padding: '0.65rem 1rem', fontSize: '0.85rem' }}
            onClick={() => exportDataAsCSV('transactions')}
          >
            <Download size={15} /> Loans CSV
          </button>
          <button 
            className="btn-premium secondary" 
            style={{ padding: '0.65rem 1rem', fontSize: '0.85rem' }}
            onClick={() => exportDataAsCSV('users')}
          >
            <Download size={15} /> Patrons CSV
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon purple">
            <BookOpen size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{totalBooks}</span>
            <span className="stat-title">Copies ({totalTitles} Titles)</span>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon cyan">
            <Users size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{totalUsers}</span>
            <span className="stat-title">Registered Patrons</span>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon orange">
            <ArrowLeftRight size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{activeLoans}</span>
            <span className="stat-title">Active Loans ({overdueLoans} Overdue)</span>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon green">
            <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>₹</span>
          </div>
          <div className="stat-details">
            <span className="stat-value">₹{totalFinesCollected.toFixed(2)}</span>
            <span className="stat-title">Fines Collected</span>
          </div>
        </div>
      </div>

      {/* 2-Column Analytics Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Category breakdown */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>
            <Layers size={18} style={{ color: 'var(--accent-purple)' }} /> Inventory Domain Breakdown
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {categoryEntries.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No catalog inventory recorded.</p>
            ) : (
              categoryEntries.map(([cat, count]) => {
                const percent = Math.round((count / (totalBooks || 1)) * 100);
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 600 }}>{cat}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{count} copies ({percent}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${percent}%`, 
                          height: '100%', 
                          background: 'var(--gradient-apex)', 
                          borderRadius: '4px',
                          boxShadow: '0 0 10px rgba(168, 85, 247, 0.4)'
                        }} 
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Most Borrowed Leaderboard */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>
            <TrendingUp size={18} style={{ color: 'var(--accent-cyan)' }} /> Top Borrowed Leaderboard
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {popularBooks.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                <p className="empty-state-desc">Borrowing circulation data will populate here as loans are issued.</p>
              </div>
            ) : (
              popularBooks.map(([title, count], index) => (
                <div 
                  key={title} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ 
                      width: '26px', 
                      height: '26px', 
                      borderRadius: '8px', 
                      background: index === 0 ? 'var(--gradient-gold)' : 'rgba(255,255,255,0.06)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '0.75rem', 
                      fontWeight: 800,
                      color: index === 0 ? '#000' : 'var(--text-primary)'
                    }}>
                      #{index + 1}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{title}</span>
                  </div>
                  <span className="badge purple" style={{ fontSize: '0.725rem' }}>
                    {count} loans
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* System Activity & Telemetry Audit Stream */}
      <div className="glass-card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>
          <Activity size={18} style={{ color: 'var(--accent-green)' }} /> Real-Time Audit Telemetry Stream
        </h2>

        {(!activityLogs || activityLogs.length === 0) ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <p className="empty-state-desc">No system audit activity recorded yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action Type</th>
                  <th>Description</th>
                  <th>Operator</th>
                </tr>
              </thead>
              <tbody>
                {activityLogs.slice(0, 8).map(log => (
                  <tr key={log.id}>
                    <td><code style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{log.timestamp}</code></td>
                    <td>
                      <span className={`badge ${
                        log.type.includes('RETURN') || log.type.includes('ISSUE') ? 'cyan' :
                        log.type.includes('PAY') || log.type.includes('ADD') ? 'green' : 'purple'
                      }`} style={{ fontSize: '0.68rem' }}>
                        {log.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{log.description}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{log.performedBy}</td>
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

export default Dashboard;
