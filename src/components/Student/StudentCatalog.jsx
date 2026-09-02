import React, { useContext, useState } from 'react';
import { LibraryContext } from '../../context/LibraryContext';
import { Search, Filter, BookOpen, Clock, Check, AlertCircle, Bookmark, Star, MessageSquare, Send, Sparkles, Layers } from 'lucide-react';
import { Modal } from '../Shared/Modal';

export const StudentCatalog = ({ searchVal }) => {
  const { books, currentUser, requestReservation, reservations, toggleWishlist, addBookReview } = useContext(LibraryContext);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [catalogTab, setCatalogTab] = useState('all'); // 'all' | 'wishlist' | 'recommended'
  
  // Book details / review modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBookForDetail, setSelectedBookForDetail] = useState(null);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');

  // Find unique categories
  const categories = ['All', ...new Set(books.map(b => b.category))];

  // Filtering books
  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes((searchVal || '').toLowerCase()) ||
      book.author.toLowerCase().includes((searchVal || '').toLowerCase()) ||
      book.isbn.includes(searchVal || '');
      
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    
    const isBookWishlisted = book.wishlist && book.wishlist.includes(currentUser?.id);
    const isRecommended = book.rating >= 4.7 || book.category === 'Programming';
    
    let matchesTab = true;
    if (catalogTab === 'wishlist') matchesTab = isBookWishlisted;
    if (catalogTab === 'recommended') matchesTab = isRecommended;

    return matchesSearch && matchesCategory && matchesTab;
  });

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
    
    setSelectedBookForDetail({
      ...selectedBookForDetail,
      reviews: [
        {
          id: Date.now().toString(),
          studentName: currentUser.name,
          rating: userRating,
          comment: userComment,
          date: new Date().toISOString().split('T')[0]
        },
        ...(selectedBookForDetail.reviews || [])
      ],
      rating: parseFloat((( (selectedBookForDetail.reviews?.reduce((sum, r) => sum + r.rating, 0) || 0) + userRating ) / ( (selectedBookForDetail.reviews?.length || 0) + 1 )).toFixed(1))
    });

    setUserComment('');
    alert("Review submitted successfully!");
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} size={14} fill="var(--accent-orange)" color="var(--accent-orange)" />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<Star key={i} size={14} fill="var(--accent-orange)" color="var(--accent-orange)" style={{ opacity: 0.7 }} />);
      } else {
        stars.push(<Star key={i} size={14} color="var(--text-muted)" />);
      }
    }
    return <div style={{ display: 'flex', gap: '0.1rem' }}>{stars}</div>;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between" style={{ marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="gradient-text-scholar" style={{ fontSize: '2rem', marginBottom: '0.25rem', fontFamily: 'Outfit, sans-serif' }}>
            Lumina Library Catalog
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Explore curated knowledge volumes, reader ratings, and bookmark favorite editions.</p>
        </div>

        {/* Category Filter */}
        <div className="flex-align" style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem 1rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
          <Filter size={16} style={{ color: 'var(--text-secondary)' }} />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Category:</span>
          <select 
            className="role-select" 
            style={{ paddingRight: '1rem', fontWeight: 600 }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-header" style={{ marginBottom: '1.5rem' }}>
        <button 
          className={`tab-btn ${catalogTab === 'all' ? 'active' : ''}`}
          onClick={() => setCatalogTab('all')}
        >
          All Catalog ({books.length})
        </button>
        <button 
          className={`tab-btn ${catalogTab === 'recommended' ? 'active' : ''}`}
          onClick={() => setCatalogTab('recommended')}
        >
          <Sparkles size={14} style={{ display: 'inline', marginRight: '4px', color: 'var(--accent-purple)' }} />
          Smart Recommendations
        </button>
        <button 
          className={`tab-btn ${catalogTab === 'wishlist' ? 'active' : ''}`}
          onClick={() => setCatalogTab('wishlist')}
        >
          <Bookmark size={14} style={{ display: 'inline', marginRight: '4px' }} />
          My Wishlist Bookmarks
        </button>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="glass-card empty-state" style={{ padding: '4rem 2rem' }}>
          <BookOpen className="empty-state-icon" />
          <h3 className="empty-state-title">No matching books found</h3>
          <p className="empty-state-desc">
            {catalogTab === 'wishlist' 
              ? "Your bookmark wishlist is currently empty. Bookmark books to review them later!"
              : "We couldn't find any books matching your search query or filters."
            }
          </p>
        </div>
      ) : (
        <div className="book-grid">
          {filteredBooks.map(book => {
            const hasRequested = getReservationStatus(book.id);
            const isOut = book.copiesAvailable === 0;
            const isWish = book.wishlist && book.wishlist.includes(currentUser?.id);

            return (
              <div key={book.id} className="glass-card book-card">
                <div>
                  <div className="book-cover-container">
                    {book.coverImage ? (
                      <img src={book.coverImage} alt={book.title} className="book-cover-img" />
                    ) : (
                      <div className="book-cover-placeholder">
                        <BookOpen size={34} className="placeholder-icon" />
                        <span className="placeholder-title">{book.title}</span>
                      </div>
                    )}
                    
                    {/* Wishlist toggle badge */}
                    <button 
                      className={`btn-premium`} 
                      style={{ 
                        position: 'absolute', 
                        top: '10px', 
                        right: '10px', 
                        padding: '0.4rem', 
                        borderRadius: '50%',
                        background: isWish ? 'var(--gradient-apex)' : 'rgba(11, 16, 28, 0.75)',
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                        width: '34px',
                        height: '34px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isWish ? 'white' : 'var(--text-secondary)',
                        backdropFilter: 'blur(8px)'
                      }}
                      onClick={() => toggleWishlist(currentUser.id, book.id)}
                      title={isWish ? "Remove Bookmark" : "Bookmark Book"}
                    >
                      <Bookmark size={15} fill={isWish ? "white" : "none"} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span className="badge cyan" style={{ textTransform: 'none', padding: '0.15rem 0.5rem', fontSize: '0.7rem' }}>
                      {book.category}
                    </span>
                    {book.rating > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-orange)' }}>
                        <Star size={13} fill="var(--accent-orange)" color="var(--accent-orange)" />
                        <span>{book.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="book-title" onClick={() => handleOpenDetails(book)} style={{ cursor: 'pointer' }}>
                    {book.title}
                  </h3>
                  <p className="book-author">by {book.author}</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Location:</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{book.location}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Stock Status:</span>
                      <span className={`badge ${isOut ? 'red' : 'green'}`} style={{ padding: '0.1rem 0.5rem', fontSize: '0.7rem' }}>
                        {isOut ? 'Out of Stock' : `${book.copiesAvailable} Left`}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="book-meta">
                    <button 
                      className="btn-premium secondary" 
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-cyan)' }}
                      onClick={() => handleOpenDetails(book)}
                    >
                      <MessageSquare size={13} /> Reviews ({book.reviews?.length || 0})
                    </button>
                    <span className="book-price">₹{book.price.toFixed(2)}</span>
                  </div>

                  <div className="book-actions">
                    {hasRequested ? (
                      <button className="btn-premium secondary" style={{ width: '100%', cursor: 'default' }} disabled>
                        <Clock size={16} /> Pending Approval
                      </button>
                    ) : (
                      <button 
                        className={`btn-premium ${isOut ? 'secondary' : 'primary'}`} 
                        style={{ width: '100%' }}
                        onClick={() => handleReserve(book)}
                        disabled={currentUser?.status !== 'active'}
                      >
                        {isOut ? (
                          <>
                            <AlertCircle size={16} /> Request Copy
                          </>
                        ) : (
                          <>
                            <BookOpen size={16} /> Reserve Book
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Book details & reviews modal */}
      {selectedBookForDetail && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title="Volume Specifications & Reviews"
        >
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <div className="book-cover-container" style={{ width: '110px', height: '150px', flexShrink: 0, marginBottom: 0 }}>
                {selectedBookForDetail.coverImage ? (
                  <img src={selectedBookForDetail.coverImage} alt={selectedBookForDetail.title} className="book-cover-img" />
                ) : (
                  <div className="book-cover-placeholder">
                    <BookOpen size={28} className="placeholder-icon" />
                  </div>
                )}
              </div>
              <div>
                <span className="badge cyan" style={{ textTransform: 'none', marginBottom: '0.4rem' }}>{selectedBookForDetail.category}</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.25, fontFamily: 'Outfit, sans-serif' }}>{selectedBookForDetail.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>by {selectedBookForDetail.author}</p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {renderStars(selectedBookForDetail.rating || 0)}
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {selectedBookForDetail.rating > 0 ? `${selectedBookForDetail.rating} / 5` : 'No reviews'}
                  </span>
                  <span style={{ marginLeft: 'auto', fontWeight: 800, fontSize: '1.15rem', color: 'var(--accent-cyan)' }}>
                    ₹{selectedBookForDetail.price.toFixed(2)}
                  </span>
                </div>
                <code style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ISBN: {selectedBookForDetail.isbn}</code>
              </div>
            </div>

            {/* Write a review */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Star size={14} style={{ color: 'var(--accent-orange)' }} /> Share your review
              </h4>
              
              <form onSubmit={handleReviewSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Rating:</span>
                  <select 
                    className="glass-input glass-select" 
                    style={{ width: '90px', padding: '0.25rem 1.5rem 0.25rem 0.5rem', fontSize: '0.825rem' }}
                    value={userRating}
                    onChange={(e) => setUserRating(parseInt(e.target.value))}
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <textarea 
                    className="glass-input" 
                    placeholder="Write your review comments..." 
                    style={{ height: '60px', fontSize: '0.85rem', resize: 'none' }}
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn-premium primary" style={{ padding: '0.5rem 0.8rem', borderRadius: '10px' }}>
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>

            {/* List Reviews */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                Reader Reviews ({selectedBookForDetail.reviews?.length || 0})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                {!selectedBookForDetail.reviews || selectedBookForDetail.reviews.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center', padding: '1rem 0' }}>
                    No reviews submitted for this title yet. Be the first to review!
                  </p>
                ) : (
                  selectedBookForDetail.reviews.map(rev => (
                    <div key={rev.id} style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{rev.studentName}</span>
                        <code style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{rev.date}</code>
                      </div>
                      <div style={{ marginBottom: '0.4rem' }}>{renderStars(rev.rating)}</div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentCatalog;
