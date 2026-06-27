import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { bookAPI } from '../../services/api';
import { FiSearch, FiFilter } from 'react-icons/fi';

const SearchBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [available, setAvailable] = useState('');
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchBooks(), 300);
    return () => clearTimeout(timer);
  }, [search, category, type, available, pagination.page]);

  const fetchCategories = async () => {
    try {
      const res = await bookAPI.getCategories();
      setCategories(res.data.categories);
    } catch (error) { console.error(error); }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await bookAPI.getBooks({
        search, category, type, available,
        page: pagination.page, limit: 12
      });
      setBooks(res.data.books);
      setPagination(res.data.pagination);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Search Books</h1>
          <p>Browse and discover from our collection of {pagination.total} books</p>
        </div>
      </div>

      <div className="filter-bar">
        <div style={{ position: 'relative', flex: 1, minWidth: 250 }}>
          <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" className="form-input" placeholder="Search by title, author, or ISBN..."
            value={search} onChange={(e) => { setSearch(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
            style={{ paddingLeft: 40, width: '100%' }} />
        </div>
        <select className="form-select" value={category} onChange={(e) => { setCategory(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select className="form-select" value={type} onChange={(e) => { setType(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}>
          <option value="">All Types</option>
          <option value="book">Books</option>
          <option value="journal">Journals</option>
          <option value="magazine">Magazines</option>
        </select>
        <select className="form-select" value={available} onChange={(e) => { setAvailable(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}>
          <option value="">All Availability</option>
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>
      </div>

      {loading ? (
        <div className="spinner-container"><div className="spinner"></div></div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No books found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="book-grid">
            {books.map(book => (
              <div key={book._id} className="book-card" onClick={() => navigate(`/book/${book._id}`)}>
                <div className="book-card-cover">
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} />
                  ) : (
                    <span>{book.type === 'journal' ? '📰' : book.type === 'magazine' ? '📓' : '📕'}</span>
                  )}
                  <span className="book-card-type">
                    <span className={`badge badge-${book.type === 'book' ? 'blue' : book.type === 'journal' ? 'purple' : 'cyan'}`}>
                      {book.type}
                    </span>
                  </span>
                </div>
                <div className="book-card-info">
                  <div className="book-card-title">{book.title}</div>
                  <div className="book-card-author">{book.author}</div>
                  <div className="book-card-meta">
                    <span className={`book-card-availability ${book.availableCopies > 0 ? 'available' : 'unavailable'}`}>
                      {book.availableCopies > 0 ? `${book.availableCopies} Available` : 'Not Available'}
                    </span>
                    {book.category && <span className="badge badge-gray">{book.category.name}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button className="pagination-btn" disabled={pagination.page === 1}
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}>←</button>
              {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                const page = i + Math.max(1, pagination.page - 2);
                if (page > pagination.pages) return null;
                return (
                  <button key={page} className={`pagination-btn ${pagination.page === page ? 'active' : ''}`}
                    onClick={() => setPagination(p => ({ ...p, page }))}>{page}</button>
                );
              })}
              <button className="pagination-btn" disabled={pagination.page === pagination.pages}
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}>→</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchBooks;
