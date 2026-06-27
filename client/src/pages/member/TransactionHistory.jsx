import { useState, useEffect } from 'react';
import { borrowAPI } from '../../services/api';
import { formatDate, getStatusColor, formatCurrency } from '../../utils/formatters';

const TransactionHistory = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const res = await borrowAPI.getMyBorrows({});
      setBorrows(res.data.borrows);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1>Transaction History</h1><p>Complete record of all your library transactions</p></div>
      </div>

      {borrows.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No transactions yet</h3>
          <p>Your borrowing history will appear here</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-header">
            <h3>All Transactions ({borrows.length})</h3>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>#</th><th>Book</th><th>Type</th><th>Status</th><th>Issue Date</th><th>Due Date</th><th>Return Date</th><th>Fine</th></tr>
              </thead>
              <tbody>
                {borrows.map((b, i) => (
                  <tr key={b._id}>
                    <td style={{ color: 'var(--text-muted)' }}>{borrows.length - i}</td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{b.book?.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.book?.author} | ISBN: {b.book?.isbn}</div>
                    </td>
                    <td><span className={`badge badge-${b.book?.type === 'book' ? 'blue' : 'purple'}`}>{b.book?.type || 'book'}</span></td>
                    <td><span className={`badge badge-${getStatusColor(b.status)}`}>{b.status}</span></td>
                    <td>{formatDate(b.issueDate)}</td>
                    <td>{formatDate(b.dueDate)}</td>
                    <td>{b.returnDate ? formatDate(b.returnDate) : '—'}</td>
                    <td>{b.fine > 0 ? (
                      <span style={{ color: b.fineStatus === 'paid' ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 600 }}>
                        {formatCurrency(b.fine)}
                      </span>
                    ) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
