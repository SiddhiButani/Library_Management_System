import { useState, useEffect } from 'react';
import { waitlistAPI } from '../../services/api';
import { formatDate, getStatusColor } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { FiX } from 'react-icons/fi';

const WaitingList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchList(); }, []);

  const fetchList = async () => {
    try {
      const res = await waitlistAPI.getMyWaitlist();
      setList(res.data.list);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleLeave = async (bookId) => {
    try {
      await waitlistAPI.leaveWaitlist(bookId);
      toast.success('Removed from waiting list');
      fetchList();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1>Waiting List</h1><p>Books you're waiting for</p></div>
      </div>

      {list.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          <h3>Waiting list is empty</h3>
          <p>You haven't joined any waiting lists</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {list.map(item => (
            <div key={item._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20 }}>
              <div style={{
                width: 50, height: 65, background: 'var(--bg-tertiary)', borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, overflow: 'hidden'
              }}>
                {item.book?.coverImage ? (
                  <img src={item.book.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : '📕'}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{item.book?.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.book?.author}</p>
                <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 12 }}>
                  <span className={`badge badge-${getStatusColor(item.status)}`}>{item.status}</span>
                  <span style={{ color: 'var(--text-muted)' }}>Position: #{item.position}</span>
                  <span style={{ color: 'var(--text-muted)' }}>Joined: {formatDate(item.createdAt)}</span>
                  {item.book?.availableCopies > 0 && (
                    <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>Now Available!</span>
                  )}
                </div>
              </div>
              {item.status === 'waiting' && (
                <button onClick={() => handleLeave(item.book._id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--accent-red)' }}>
                  <FiX /> Leave
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WaitingList;
