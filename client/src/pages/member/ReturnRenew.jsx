import { useState, useEffect } from 'react';
import { borrowAPI } from '../../services/api';
import { formatDate, daysUntil } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { FiRefreshCw, FiCornerDownLeft } from 'react-icons/fi';

const ReturnRenew = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => { fetchBorrows(); }, []);

  const fetchBorrows = async () => {
    try {
      const res = await borrowAPI.getMyBorrows({ status: 'issued' });
      setBorrows(res.data.borrows);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleRenew = async (id) => {
    setActionLoading(id);
    try {
      const res = await borrowAPI.renewBook(id);
      toast.success(res.data.message);
      fetchBorrows();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Renewal failed');
    } finally { setActionLoading(''); }
  };

  const handleReturn = async (id) => {
    setActionLoading(id);
    try {
      const res = await borrowAPI.returnBook(id);
      toast.success(res.data.message);
      fetchBorrows();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Return failed');
    } finally { setActionLoading(''); }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1>Return / Renew</h1><p>Manage your currently borrowed books</p></div>
      </div>

      {borrows.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📖</div>
          <h3>No active borrows</h3>
          <p>You don't have any books to return or renew</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {borrows.map(borrow => {
            const days = daysUntil(borrow.dueDate);
            const isOverdue = days < 0;
            const canRenew = borrow.renewCount < borrow.maxRenewals && !isOverdue;

            return (
              <div key={borrow._id} className="card" style={{
                display: 'flex', alignItems: 'center', gap: 20, padding: 20,
                border: isOverdue ? '1px solid rgba(239,68,68,0.3)' : undefined
              }}>
                <div style={{
                  width: 60, height: 80, background: 'var(--bg-tertiary)', borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0, overflow: 'hidden'
                }}>
                  {borrow.book?.coverImage ? (
                    <img src={borrow.book.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : '📕'}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{borrow.book?.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{borrow.book?.author}</p>
                  <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 13 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      Issued: {formatDate(borrow.issueDate)}
                    </span>
                    <span style={{ color: isOverdue ? 'var(--accent-red)' : days <= 3 ? 'var(--accent-orange)' : 'var(--accent-green)', fontWeight: 600 }}>
                      Due: {formatDate(borrow.dueDate)} ({isOverdue ? `${Math.abs(days)} days overdue` : `${days} days left`})
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      Renewals: {borrow.renewCount} / {borrow.maxRenewals}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {canRenew && (
                    <button onClick={() => handleRenew(borrow._id)} className="btn btn-outline btn-sm"
                      disabled={actionLoading === borrow._id}>
                      <FiRefreshCw /> Renew
                    </button>
                  )}
                  <button onClick={() => handleReturn(borrow._id)} className="btn btn-primary btn-sm"
                    disabled={actionLoading === borrow._id}>
                    <FiCornerDownLeft /> Return
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReturnRenew;
