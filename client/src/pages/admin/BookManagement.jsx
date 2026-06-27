import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bookAPI } from '../../services/api';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => fetchBooks(), 300);
    return () => clearTimeout(timer);
  }, [search, pagination.page]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await bookAPI.getBooks({ search, page: pagination.page, limit: 10 });
      setBooks(res.data.books);
      setPagination(res.data.pagination);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await bookAPI.deleteBook(id);
      toast.success('Book deleted');
      fetchBooks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Book Management</h1><p>Manage your library's book collection</p></div>
        <Link to="/admin/books/new" className="btn btn-primary"><FiPlus /> Add New Book</Link>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>All Books ({pagination.total})</h3>
          <div className="table-actions">
            <div style={{ position: 'relative' }}>
              <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" className="table-search" placeholder="Search books..." value={search}
                onChange={(e) => { setSearch(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                style={{ paddingLeft: 36 }} />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Book</th><th>ISBN</th><th>Category</th><th>Type</th><th>Copies</th><th>Available</th><th>Added</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 52, background: 'var(--bg-tertiary)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, overflow: 'hidden' }}>
                          {book.coverImage ? <img src={book.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📕'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{book.title}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{book.author}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 13, fontFamily: 'monospace' }}>{book.isbn}</td>
                    <td><span className="badge badge-blue">{book.category?.name || 'N/A'}</span></td>
                    <td><span className={`badge badge-${book.type === 'book' ? 'blue' : book.type === 'journal' ? 'purple' : 'cyan'}`}>{book.type}</span></td>
                    <td>{book.totalCopies}</td>
                    <td>
                      <span style={{ fontWeight: 600, color: book.availableCopies > 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                        {book.availableCopies}
                      </span>
                    </td>
                    <td>{formatDate(book.createdAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => navigate(`/admin/books/edit/${book._id}`)} className="btn btn-ghost btn-icon" title="Edit"><FiEdit2 /></button>
                        <button onClick={() => handleDelete(book._id, book.title)} className="btn btn-ghost btn-icon" title="Delete" style={{ color: 'var(--accent-red)' }}><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="pagination">
            <button className="pagination-btn" disabled={pagination.page === 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}>←</button>
            {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
              const page = i + Math.max(1, pagination.page - 2);
              if (page > pagination.pages) return null;
              return <button key={page} className={`pagination-btn ${pagination.page === page ? 'active' : ''}`} onClick={() => setPagination(p => ({ ...p, page }))}>{page}</button>;
            })}
            <button className="pagination-btn" disabled={pagination.page === pagination.pages} onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}>→</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookManagement;
