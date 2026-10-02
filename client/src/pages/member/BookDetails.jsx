import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookAPI, borrowAPI, waitlistAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiBookOpen, FiClock, FiUser, FiCalendar, FiHash, FiLayers, FiMapPin, FiTag } from 'react-icons/fi';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowLoading, setBorrowLoading] = useState(false);
  const [borrowCount, setBorrowCount] = useState(0);

  useEffect(() => { fetchBook(); }, [id]);

  const fetchBook = async () => {
    try {
      const res = await bookAPI.getBook(id);
      setBook(res.data.book);
      setBorrowCount(res.data.borrowCount);
    } catch (error) {
      toast.error('Book not found');
      navigate('/search');
    } finally { setLoading(false); }
  };

  const handleBorrow = async () => {
    setBorrowLoading(true);
    try {
      await borrowAPI.requestBook({ bookId: id });
      toast.success('Borrow request submitted! Awaiting admin approval.');
      fetchBook();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    } finally { setBorrowLoading(false); }
  };

  const handleJoinWaitlist = async () => {
    try {
      const res = await waitlistAPI.joinWaitlist(id);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join waitlist');
    }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;
  if (!book) return null;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ marginBottom: 16 }}>
        <FiArrowLeft /> Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 32 }}>
        {/* Book Cover */}
        <div>
          <div style={{
            height: 400, background: 'var(--gradient-card)', border: '1px solid var(--border-secondary)',
            borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80
          }}>
            {book.coverImage ? (
              <img src={book.coverImage} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : '📕'}
          </div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {book.availableCopies > 0 ? (
              <button onClick={handleBorrow} className="btn btn-primary btn-lg" disabled={borrowLoading} style={{ width: '100%' }}>
                <FiBookOpen /> {borrowLoading ? 'Requesting...' : 'Borrow This Book'}
              </button>
            ) : (
              <button onClick={handleJoinWaitlist} className="btn btn-warning btn-lg" style={{ width: '100%' }}>
                <FiClock /> Join Waiting List
              </button>
            )}
          </div>
        </div>

        {/* Book Details */}
        <div>
          <div style={{ marginBottom: 8 }}>
            <span className={`badge badge-${book.type === 'book' ? 'blue' : book.type === 'journal' ? 'purple' : 'cyan'}`}>
              {book.type}
            </span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>{book.title}</h1>
          <p style={{ fontSize: 18, color: 'var(--text-muted)', marginBottom: 20 }}>by {book.author}</p>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 16, marginBottom: 24, padding: '18px 24px',
            background: '#ffffff', border: '1px solid var(--border-secondary)', borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: book.availableCopies > 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                {book.availableCopies}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 2 }}>Available</div>
            </div>
            <div style={{ width: 1, height: 36, background: '#cbd5e1' }}></div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--accent-blue)' }}>{book.totalCopies}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 2 }}>Total Copies</div>
            </div>
            <div style={{ width: 1, height: 36, background: '#cbd5e1' }}></div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--accent-purple)' }}>{borrowCount}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 2 }}>Times Borrowed</div>
            </div>
          </div>

          {book.description && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Description</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 14 }}>{book.description}</p>
            </div>
          )}

          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Book Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
              {[
                { icon: <FiHash />, label: 'ISBN', value: book.isbn },
                { icon: <FiLayers />, label: 'Edition', value: book.edition },
                { icon: <FiCalendar />, label: 'Published', value: book.publishedYear },
                { icon: <FiUser />, label: 'Publisher', value: book.publisher || 'N/A' },
                { icon: <FiTag />, label: 'Category', value: book.category?.name },
                { icon: <FiBookOpen />, label: 'Pages', value: book.pages || 'N/A' },
                { icon: <FiMapPin />, label: 'Location', value: book.location?.shelf ? `Shelf ${book.location.shelf}, Rack ${book.location.rack}` : 'N/A' },
                { icon: <FiTag />, label: 'Language', value: book.language }
              ].map((item, i) => (
                <div key={i} className="profile-field" style={{ padding: '12px 16px' }}>
                  <span className="profile-field-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {item.icon} {item.label}
                  </span>
                  <span className="profile-field-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {book.tags?.length > 0 && (
            <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {book.tags.map((tag, i) => (
                <span key={i} className="badge badge-blue">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
