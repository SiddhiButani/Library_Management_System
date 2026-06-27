import { useState } from 'react';
import { bookAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiSearch, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

const BookAvailability = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) { toast.error('Please enter a search term'); return; }
    setLoading(true);
    setSearched(true);
    try {
      const res = await bookAPI.getBooks({ search, limit: 20 });
      setResults(res.data.books);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header" style={{ textAlign: 'center', flexDirection: 'column' }}>
        <h1>Book Availability Check</h1>
        <p>Quickly check if a book is available in our library</p>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto 32px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FiSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" className="form-input" placeholder="Enter book title, author, or ISBN..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 44, padding: '14px 16px 14px 44px', fontSize: 15 }} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Checking...' : 'Check'}
          </button>
        </form>
      </div>

      {loading ? <div className="spinner-container"><div className="spinner"></div></div> : searched && (
        results.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <h3>No books found</h3>
            <p>Try searching with a different title or ISBN</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 800, margin: '0 auto' }}>
            {results.map(book => (
              <div key={book._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20 }}>
                <div style={{
                  width: 50, height: 65, background: 'var(--bg-tertiary)', borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0
                }}>
                  {book.coverImage ? <img src={book.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} /> : '📕'}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{book.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{book.author} • ISBN: {book.isbn}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    color: book.availableCopies > 0 ? 'var(--accent-green)' : 'var(--accent-red)',
                    fontWeight: 700, fontSize: 15, marginBottom: 4
                  }}>
                    {book.availableCopies > 0 ? <FiCheckCircle /> : <FiXCircle />}
                    {book.availableCopies > 0 ? 'Available' : 'Not Available'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {book.availableCopies} of {book.totalCopies} copies
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default BookAvailability;
