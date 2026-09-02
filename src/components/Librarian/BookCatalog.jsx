import React, { useContext, useState } from 'react';
import { LibraryContext } from '../../context/LibraryContext';
import { Modal } from '../Shared/Modal';
import { Plus, Edit2, Trash2, Library, Tag, AlertCircle } from 'lucide-react';

export const BookCatalog = ({ searchVal }) => {
  const { books, addBook, updateBook, deleteBook } = useContext(LibraryContext);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedBook, setSelectedBook] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [totalCopies, setTotalCopies] = useState('');
  const [location, setLocation] = useState('');
  
  // Drag and drop states
  const [dragActive, setDragActive] = useState(false);
  const [coverImage, setCoverImage] = useState('');

  // Drag handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onButtonClick = () => {
    document.getElementById("file-upload").click();
  };

  // Handle open modal
  const handleOpenAdd = () => {
    setModalMode('add');
    setTitle('');
    setAuthor('');
    setIsbn('');
    setCategory('');
    setPrice('');
    setTotalCopies('');
    setLocation('');
    setCoverImage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (book) => {
    setModalMode('edit');
    setSelectedBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setIsbn(book.isbn);
    setCategory(book.category);
    setPrice(book.price.toString());
    setTotalCopies(book.totalCopies.toString());
    setLocation(book.location);
    setCoverImage(book.coverImage || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !author || !isbn || !category || !totalCopies || !location) return;

    const bookData = {
      title,
      author,
      isbn,
      category,
      price: parseFloat(price) || 0,
      totalCopies: parseInt(totalCopies),
      location,
      coverImage
    };

    if (modalMode === 'add') {
      addBook(bookData);
    } else {
      updateBook({
        id: selectedBook.id,
        ...bookData
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (bookId) => {
    if (window.confirm("Are you sure you want to delete this book from catalog?")) {
      deleteBook(bookId);
    }
  };

  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'low-stock'

  // Filtering books
  const filteredBooks = (books || []).filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes((searchVal || '').toLowerCase()) ||
      book.author.toLowerCase().includes((searchVal || '').toLowerCase()) ||
      book.isbn.includes(searchVal || '') ||
      book.category.toLowerCase().includes((searchVal || '').toLowerCase());
      
    const matchesStock = stockFilter === 'all' || book.copiesAvailable === 0;

    return matchesSearch && matchesStock;
  });

  return (
    <div className="animate-fade-in">
      {/* Clean Inventory Header */}
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.25rem', fontFamily: 'Outfit, sans-serif' }}>
            Book Inventory
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Catalog new editions, monitor inventory availability across shelf stacks, and maintain book details.
          </p>
        </div>

        <div className="flex-align">
          <select 
            className="glass-input glass-select"
            style={{ width: '160px', padding: '0.45rem 2rem 0.45rem 1rem', fontSize: '0.85rem' }}
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="all">All Inventory</option>
            <option value="low-stock">Out of Stock</option>
          </select>
          
          <button className="btn-premium primary" onClick={handleOpenAdd}>
            <Plus size={18} /> Add New Book
          </button>
        </div>
      </div>

      {/* Books Table */}
      <div className="glass-card">
        {filteredBooks.length === 0 ? (
          <div className="empty-state">
            <Library size={48} className="empty-state-icon" />
            <h3 className="empty-state-title">No matching inventory records</h3>
            <p className="empty-state-desc">Try clearing search terms or resetting inventory filters.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Title / Author</th>
                  <th>ISBN</th>
                  <th>Category</th>
                  <th>Shelf Location</th>
                  <th>Price</th>
                  <th>Availability & Stock</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map(book => (
                  <tr key={book.id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{book.title}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.825rem' }}>by {book.author}</div>
                      </div>
                    </td>
                    <td><code>{book.isbn}</code></td>
                    <td>
                      <span className="badge cyan" style={{ gap: '0.3rem', fontSize: '0.725rem', textTransform: 'none', display: 'inline-flex', padding: '0.2rem 0.5rem' }}>
                        <Tag size={12} />
                        {book.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{book.location}</td>
                    <td style={{ fontWeight: 700 }}>₹{book.price.toFixed(2)}</td>
                    <td>
                      <div className="flex-align" style={{ gap: '0.5rem' }}>
                        <span className={`badge ${book.copiesAvailable > 0 ? 'green' : 'red'}`} style={{ padding: '0.15rem 0.55rem', fontSize: '0.75rem' }}>
                          {book.copiesAvailable} / {book.totalCopies} Available
                        </span>
                        {book.copiesAvailable === 0 && (
                          <span className="badge red" style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem' }}>
                            <AlertCircle size={10} style={{ marginRight: '0.2rem' }} /> Reorder
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button 
                          className="btn-premium secondary" 
                          style={{ padding: '0.45rem', borderRadius: '8px' }}
                          title="Edit Book details"
                          onClick={() => handleOpenEdit(book)}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          className="btn-premium danger" 
                          style={{ padding: '0.45rem', borderRadius: '8px' }}
                          title="Delete Book"
                          onClick={() => handleDelete(book.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Book Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Catalog New Book' : 'Update Book Details'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Book Title</label>
            <input 
              type="text" 
              className="glass-input" 
              placeholder="e.g. Introduction to Algorithms" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Author Name(s)</label>
            <input 
              type="text" 
              className="glass-input" 
              placeholder="e.g. Thomas H. Cormen" 
              value={author} 
              onChange={(e) => setAuthor(e.target.value)} 
              required 
            />
          </div>

          <div className="grid-gap-2">
            <div className="form-group">
              <label className="form-label">ISBN-13</label>
              <input 
                type="text" 
                className="glass-input" 
                placeholder="e.g. 978-0262033848" 
                value={isbn} 
                onChange={(e) => setIsbn(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Book Category</label>
              <input 
                type="text" 
                className="glass-input" 
                placeholder="e.g. Programming" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="grid-gap-2">
            <div className="form-group">
              <label className="form-label">Purchase Price (₹)</label>
              <input 
                type="number" 
                step="0.01" 
                className="glass-input" 
                placeholder="e.g. 499.00" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Total Copies in Stock</label>
              <input 
                type="number" 
                min="1" 
                className="glass-input" 
                placeholder="e.g. 3" 
                value={totalCopies} 
                onChange={(e) => setTotalCopies(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Book Cover Image</label>
            <div 
              className={`drag-drop-zone ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={onButtonClick}
              type="button"
            >
              <input 
                type="file" 
                id="file-upload" 
                style={{ display: 'none' }} 
                accept="image/*" 
                onChange={handleChange} 
              />
              
              {coverImage ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="drag-drop-preview">
                    <img src={coverImage} alt="Cover preview" />
                    <button 
                      type="button" 
                      className="drag-drop-remove" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setCoverImage('');
                      }}
                    >
                      &times;
                    </button>
                  </div>
                  <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Click or drag to replace cover</span>
                </div>
              ) : (
                <>
                  <Plus size={20} style={{ color: 'var(--accent-cyan)' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Drag & drop book cover image here</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Supports JPG, PNG, WEBP (or click to browse)</span>
                </>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Shelf Location</label>
            <input 
              type="text" 
              className="glass-input" 
              placeholder="e.g. Shelf B-4" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              required 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn-premium secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-premium primary">
              {modalMode === 'add' ? 'Add Book' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BookCatalog;
