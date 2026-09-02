import React, { useContext, useState } from 'react';
import { LibraryContext } from '../../context/LibraryContext';
import { Sparkles, Star, Bookmark, BookOpen, AlertCircle, ArrowRight, Zap, Flame, Award } from 'lucide-react';
import { Modal } from '../Shared/Modal';

export const SmartRecommendations = ({ onNavigateToCatalog }) => {
  const { currentUser, getSmartRecommendations, toggleWishlist, requestReservation, reservations, addBookReview } = useContext(LibraryContext);
  
  const [filterType, setFilterType] = useState('all'); // 'all' | 'high-match' | 'top-rated'
  const [selectedBookForDetail, setSelectedBookForDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');

  const recommendations = getSmartRecommendations(currentUser?.id) || [];

  const filteredRecs = recommendations.filter(book => {
    if (filterType === 'high-match') return book.matchPercentage >= 90;
    if (filterType === 'top-rated') return book.rating >= 4.8;
    return true;
  }).slice(0, 6); // Display top 6 recommendations

  const getReservationStatus = (bookId) => {
    const match = reservations.find(r => r.bookId === bookId && r.studentId === currentUser?.id && r.status === 'pending');
    return match ? 'pending' : null;
  };

  const handleReserve = (book) => {
    requestReservation(currentUser.id, book.id);
    alert(`Hold request submitted for "${book.title}". Awaiting librarian approval.`);
  };

  const handleOpenDetails = (book) => {
    setSelectedBookForDetail(book);
    setUserRating(5);
    setUserComment('');
    setIsDetailModalOpen(true);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!userComment.trim() || !selectedBookForDetail) return;

    addBookReview(selectedBookForDetail.id, currentUser.name, userRating, userComment);
    alert("Review submitted successfully!");
    setIsDetailModalOpen(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={13} 
          fill={i <= fullStars ? "var(--accent-orange)" : "none"} 
          color={i <= fullStars ? "var(--accent-orange)" : "var(--text-muted)"} 
        />
      );
    }
    return <div style={{ display: 'flex', gap: '2px' }}>{stars}</div>;
  };

  return (
    <div className="glass-card smart-rec-card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(22, 28, 45, 0.6) 0%, rgba(99, 102, 241, 0.08) 50%, rgba(6, 182, 212, 0.05) 100%)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
      {/* Header */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: '12px', 
            background: 'var(--gradient-primary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={22} color="white" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em' }} className="gradient-text">
                Smart Book Recommendations
              </h2>
              <span className="badge purple" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                AI Personalized
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Tailored for <strong>{currentUser?.name}</strong> based on borrowing activity, genre affinity, and reader ratings.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(15, 23, 42, 0.5)', padding: '0.3rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <button 
            className="tab-btn" 
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: '8px', borderBottom: 'none', background: filterType === 'all' ? 'var(--gradient-cyan-indigo)' : 'transparent', color: filterType === 'all' ? 'white' : 'var(--text-secondary)' }}
            onClick={() => setFilterType('all')}
          >
            All Top Picks
          </button>
          <button 
            className="tab-btn" 
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: '8px', borderBottom: 'none', background: filterType === 'high-match' ? 'var(--gradient-cyan-indigo)' : 'transparent', color: filterType === 'high-match' ? 'white' : 'var(--text-secondary)' }}
            onClick={() => setFilterType('high-match')}
          >
            <Zap size={12} style={{ display: 'inline', marginRight: '3px' }} /> 90%+ Match
          </button>
          <button 
            className="tab-btn" 
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: '8px', borderBottom: 'none', background: filterType === 'top-rated' ? 'var(--gradient-cyan-indigo)' : 'transparent', color: filterType === 'top-rated' ? 'white' : 'var(--text-secondary)' }}
            onClick={() => setFilterType('top-rated')}
          >
            <Award size={12} style={{ display: 'inline', marginRight: '3px' }} /> Top Rated
          </button>
        </div>
      </div>

      {/* Grid of Recommendations */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1.25rem',
        marginTop: '1rem'
      }}>
        {filteredRecs.map(book => {
          const hasRequested = getReservationStatus(book.id);
          const isOut = book.copiesAvailable === 0;
          const isWish = book.wishlist && book.wishlist.includes(currentUser?.id);

          return (
            <div 
              key={book.id} 
              className="glass-card" 
              style={{ 
                padding: '1.25rem', 
                background: 'rgba(15, 23, 42, 0.65)', 
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                transition: 'all 0.25s ease'
              }}
            >
              <div>
                {/* Match Score & Reason Pill */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.3rem', 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '20px', 
                    background: book.matchPercentage >= 95 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                    border: `1px solid ${book.matchPercentage >= 95 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(99, 102, 241, 0.4)'}`,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: book.matchPercentage >= 95 ? '#34d399' : '#818cf8'
                  }}>
                    <Zap size={12} fill="currentColor" />
                    <span>{book.matchPercentage}% Match</span>
                  </div>

                  {/* Bookmark Button */}
                  <button 
                    onClick={() => toggleWishlist(currentUser.id, book.id)}
                    title={isWish ? "Remove Bookmark" : "Bookmark Book"}
                    style={{
                      background: isWish ? 'rgba(217, 70, 239, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${isWish ? 'rgba(217, 70, 239, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: isWish ? 'var(--accent-purple)' : 'var(--text-secondary)'
                    }}
                  >
                    <Bookmark size={14} fill={isWish ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* Reason subtitle */}
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: 'var(--accent-cyan)', 
                  fontWeight: 600, 
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <Flame size={12} />
                  <span>{book.recommendationReason}</span>
                </div>

                {/* Title and Author */}
                <h3 
                  style={{ 
                    fontSize: '1.05rem', 
                    fontWeight: 700, 
                    marginBottom: '0.25rem', 
                    lineHeight: 1.3,
                    cursor: 'pointer' 
                  }}
                  onClick={() => handleOpenDetails(book)}
                  title="Click to view reviews & details"
                >
                  {book.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  by {book.author}
                </p>

                {/* Category and Rating */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="badge cyan" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem', textTransform: 'none' }}>
                    {book.category}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {renderStars(book.rating || 4.5)}
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {book.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Meta & Reserve action */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.75rem', marginTop: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {isOut ? (
                      <span style={{ color: 'var(--accent-red)' }}>Out of Stock</span>
                    ) : (
                      <span style={{ color: 'var(--accent-green)' }}>{book.copiesAvailable} copies left</span>
                    )}
                  </span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    ₹{book.price.toFixed(2)}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn-premium secondary"
                    style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem' }}
                    onClick={() => handleOpenDetails(book)}
                  >
                    Details
                  </button>
                  {hasRequested ? (
                    <button className="btn-premium secondary" style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem', cursor: 'default' }} disabled>
                      Requested
                    </button>
                  ) : (
                    <button 
                      className={`btn-premium ${isOut ? 'secondary' : 'primary'}`}
                      style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem' }}
                      onClick={() => handleReserve(book)}
                      disabled={currentUser?.status !== 'active'}
                    >
                      {isOut ? 'Request Copy' : 'Reserve'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Details & Review Modal */}
      {selectedBookForDetail && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title="Recommended Title Details"
        >
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="badge cyan" style={{ textTransform: 'none' }}>{selectedBookForDetail.category}</span>
                <span className="badge purple" style={{ fontSize: '0.7rem' }}>{selectedBookForDetail.matchPercentage}% Recommendation Match</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, lineHeight: 1.2 }}>{selectedBookForDetail.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>by {selectedBookForDetail.author}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {renderStars(selectedBookForDetail.rating || 0)}
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {selectedBookForDetail.rating > 0 ? `${selectedBookForDetail.rating} / 5` : 'No reviews'}
                </span>
                <span style={{ marginLeft: 'auto', fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  ₹{selectedBookForDetail.price.toFixed(2)}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Shelf Location: <strong>{selectedBookForDetail.location}</strong> | ISBN: <code>{selectedBookForDetail.isbn}</code>
              </p>
            </div>

            {/* Submit Quick Review */}
            <form onSubmit={handleReviewSubmit} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>Leave a Rating</h4>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <select 
                  className="glass-input glass-select"
                  value={userRating}
                  onChange={(e) => setUserRating(parseInt(e.target.value))}
                  style={{ width: '100px', fontSize: '0.85rem', padding: '0.3rem 1.5rem 0.3rem 0.5rem' }}
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
                <input 
                  type="text" 
                  className="glass-input" 
                  placeholder="Share feedback on this recommendation..."
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  style={{ flex: 1, fontSize: '0.85rem' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn-premium primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SmartRecommendations;
