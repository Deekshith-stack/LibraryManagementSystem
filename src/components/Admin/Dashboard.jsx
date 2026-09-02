import React, { useContext, useState } from 'react';
import { LibraryContext } from '../../context/LibraryContext';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  Download, 
  History, 
  Trash2, 
  Award,
  Sparkles,
  BookOpenCheck
} from 'lucide-react';

export const Dashboard = () => {
  const { books, users, transactions, systemLogs, clearSystemLogs, paymentRecords } = useContext(LibraryContext);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'audit'

  // Statistics calculation
  const totalBooksCount = (books || []).reduce((sum, b) => sum + b.totalCopies, 0);
  const activeLoansCount = (transactions || []).filter(t => !t.returnDate).length;
  const totalRegisteredUsers = (users || []).length;
  
  // Total fines calculated dynamically from payment records in ₹
  const totalFinesCollected = paymentRecords ? paymentRecords.reduce((sum, r) => sum + r.amountPaid, 0) : 0;

  // Category distribution for charts
  const categoryCounts = (books || []).reduce((acc, book) => {
    acc[book.category] = (acc[book.category] || 0) + book.totalCopies;
    return acc;
  }, {});

  const totalCopiesOfAll = Object.values(categoryCounts).reduce((a, b) => a + b, 0);
  const chartData = Object.entries(categoryCounts).map(([cat, count]) => ({
    name: cat,
    value: count,
    percentage: totalCopiesOfAll > 0 ? (count / totalCopiesOfAll) * 100 : 0
  }));

  // Dynamic Popular Books Leaderboard
  const borrowCounts = (transactions || []).reduce((acc, tx) => {
    acc[tx.bookTitle] = (acc[tx.bookTitle] || 0) + 1;
    return acc;
  }, {});

  const leaderboard = Object.entries(borrowCounts)
    .map(([title, count]) => {
      const bookObj = books.find(b => b.title === title);
      return {
        title,
        count,
        author: bookObj ? bookObj.author : 'Unknown Author',
        category: bookObj ? bookObj.category : 'General'
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // CSV Exporter helper
  const handleExportCSV = (type) => {
    let data = [];
    let filename = '';
    let headers = [];

    if (type === 'books') {
      data = books.map(b => ({
        ID: b.id,
        Title: b.title,
        Author: b.author,
        ISBN: b.isbn,
        Category: b.category,
        Price_INR: b.price,
        Total_Copies: b.totalCopies,
        Available_Copies: b.copiesAvailable,
        Shelf_Location: b.location
      }));
      filename = 'Library_Books_Catalog.csv';
      headers = ['ID', 'Title', 'Author', 'ISBN', 'Category', 'Price_INR', 'Total_Copies', 'Available_Copies', 'Shelf_Location'];
    } else if (type === 'users') {
      data = users.map(u => ({
        ID: u.id,
        Name: u.name,
        Email: u.email,
        Role: u.role,
        Status: u.status,
        Enrollment_Employee_ID: u.enrollmentId || u.employeeId || 'N/A'
      }));
      filename = 'Library_Users_Directory.csv';
      headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Enrollment_Employee_ID'];
    } else if (type === 'transactions') {
      data = transactions.map(t => ({
        Transaction_ID: t.id,
        Book_Title: t.bookTitle,
        Student_Name: t.studentName,
        Student_ID: t.studentId,
        Issue_Date: t.issueDate,
        Due_Date: t.dueDate,
        Return_Date: t.returnDate || 'Active Out',
        Fine_Amount_INR: t.fineAmount,
        Status: t.status
      }));
      filename = 'Library_Circulation_Logs.csv';
      headers = ['Transaction_ID', 'Book_Title', 'Student_Name', 'Student_ID', 'Issue_Date', 'Due_Date', 'Return_Date', 'Fine_Amount_INR', 'Status'];
    }

    if (data.length === 0) return;

    const csvRows = [];
    csvRows.push(headers.join(','));

    data.forEach(row => {
      const values = headers.map(header => {
        const val = row[header];
        const escaped = ('' + val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getLogBadgeColor = (type) => {
    switch (type) {
      case 'security': return 'red';
      case 'settings': return 'purple';
      case 'issue': return 'cyan';
      case 'return': return 'green';
      case 'payment': return 'orange';
      case 'book': return 'indigo';
      default: return 'indigo';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Library Management Control</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Executive portal containing system logs, inventory statistics, and CSV data exports.</p>
        </div>

        {/* Tab switchers */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.4)', padding: '0.35rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <button 
            className="btn-premium" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: activeTab === 'overview' ? 'var(--gradient-cyan-indigo)' : 'transparent', borderRadius: '8px' }}
            onClick={() => setActiveTab('overview')}
          >
            Overview & Stats
          </button>
          <button 
            className="btn-premium" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: activeTab === 'audit' ? 'var(--gradient-cyan-indigo)' : 'transparent', borderRadius: '8px' }}
            onClick={() => setActiveTab('audit')}
          >
            <History size={14} style={{ marginRight: '0.3rem' }} /> Audit Log Trail
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' ? (
        <>
          {/* Stats grid */}
          <div className="stats-grid">
            <div className="glass-card stat-card">
              <div className="stat-icon cyan">
                <BookOpen size={24} />
              </div>
              <div className="stat-details">
                <span className="stat-value">{totalBooksCount}</span>
                <span className="stat-title">Catalog Volume</span>
              </div>
            </div>

            <div className="glass-card stat-card">
              <div className="stat-icon indigo">
                <BookOpenCheck size={24} />
              </div>
              <div className="stat-details">
                <span className="stat-value">{activeLoansCount}</span>
                <span className="stat-title">Active Loans</span>
              </div>
            </div>

            <div className="glass-card stat-card">
              <div className="stat-icon orange">
                <Users size={24} />
              </div>
              <div className="stat-details">
                <span className="stat-value">{totalRegisteredUsers}</span>
                <span className="stat-title">Registered Patrons</span>
              </div>
            </div>

            <div className="glass-card stat-card">
              <div className="stat-icon green">
                <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>₹</span>
              </div>
              <div className="stat-details">
                <span className="stat-value">₹{totalFinesCollected.toFixed(2)}</span>
                <span className="stat-title">Collected Fines</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', marginBottom: '2rem' }}>
            
            {/* Category distribution */}
            <div className="glass-card">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Category Distribution</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {chartData.map((data, idx) => (
                  <div key={data.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 500 }}>{data.name}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{data.value} copies ({Math.round(data.percentage)}%)</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          width: `${data.percentage}%`, 
                          background: idx % 2 === 0 ? 'var(--gradient-cyan-indigo)' : 'var(--gradient-purple-red)',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popularity Leaderboard */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Award size={18} style={{ color: 'var(--accent-orange)' }} /> Top Borrowed Titles
                </h3>
                
                {leaderboard.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem' }}>
                    Fresh session initialized. As books are checked out, the popularity leaderboard will update in real time.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {leaderboard.map((book, idx) => (
                      <div key={book.title} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.015)', border: '1px solid var(--border-color)' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: idx === 0 ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                          #{idx + 1}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={book.title}>{book.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>by {book.author}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{book.count}</span>
                          <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Loans</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ background: 'rgba(99,102,241,0.03)', border: '1px solid rgba(99,102,241,0.1)', padding: '0.75rem', borderRadius: '10px', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                <Sparkles size={14} style={{ color: 'var(--accent-purple)' }} />
                <span>Leaderboard is computed dynamically from circulation transactions.</span>
              </div>
            </div>

          </div>

          {/* Recent Payments Logs */}
          <div className="glass-card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ color: 'var(--accent-green)', fontWeight: 800 }}>₹</span> Recent Fine Payments Received
            </h3>

            {paymentRecords && paymentRecords.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center', padding: '1.5rem 0' }}>
                No payment history recorded in system yet.
              </p>
            ) : (
              <div className="table-container">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Receipt ID</th>
                      <th>Patron Name</th>
                      <th>Book Title</th>
                      <th>Payment Date</th>
                      <th>Amount Collected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(paymentRecords || []).slice(0, 5).map(pay => (
                      <tr key={pay.id}>
                        <td><code>{pay.id.substring(4, 12)}</code></td>
                        <td style={{ fontWeight: 600 }}>{pay.studentName}</td>
                        <td>{pay.bookTitle}</td>
                        <td>{pay.date}</td>
                        <td style={{ fontWeight: 700, color: 'var(--accent-green)' }}>₹{pay.amountPaid.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Export Data Panel */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Data Export Center</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Export system inventory databases to CSV spreadsheets for local analysis and reporting.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <button className="btn-premium secondary" onClick={() => handleExportCSV('books')} style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
                <Download size={16} />
                <span>Export Books Inventory</span>
              </button>

              <button className="btn-premium secondary" onClick={() => handleExportCSV('users')} style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
                <Download size={16} />
                <span>Export Users Directory</span>
              </button>

              <button className="btn-premium secondary" onClick={() => handleExportCSV('transactions')} style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
                <Download size={16} />
                <span>Export Circulation Logs</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Audit Trail Tab */
        <div className="glass-card animate-fade-in">
          <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={20} className="gradient-text" /> Global Event Trail Logs
            </h3>
            
            <button className="btn-premium danger" onClick={clearSystemLogs} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.3rem' }}>
              <Trash2 size={12} /> Clear Logs
            </button>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Audits all library occurrences (member registrations, checkouts, returns, settings modifications) in real time.
          </p>

          <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', background: 'rgba(15,22,38,0.2)' }}>
            <div style={{ maxHeight: '450px', overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(systemLogs || []).length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '3rem 0' }}>
                  System log is currently empty.
                </p>
              ) : (
                systemLogs.map(log => (
                  <div key={log.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                    <span className={`badge ${getLogBadgeColor(log.type)}`} style={{ padding: '0.15rem 0.5rem', fontSize: '0.65rem', flexShrink: 0 }}>
                      {log.type}
                    </span>
                    
                    <span style={{ fontSize: '0.875rem', flex: 1, lineHeight: 1.4 }}>{log.text}</span>
                    
                    <code style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>{log.timestamp}</code>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
