import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { borrowAPI } from '../../services/api';
import { formatDate, daysUntil, getStatusColor } from '../../utils/formatters';
import { FiBookOpen, FiClock, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const BorrowedBooks = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => { fetchBorrows(); }, [filter]);

  const fetchBorrows = async () => {
    setLoading(true);
    try {
      const res = await borrowAPI.getMyBorrows({ status: filter });
      setBorrows(res.data.borrows);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'issued': return <FiBookOpen />;
      case 'pending': return <FiClock />;
      case 'returned': return <FiCheckCircle />;
      case 'overdue': return <FiAlertTriangle />;
      default: return <FiBookOpen />;
    }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Borrowed Books</h1><p>View all your borrowed and returned books</p></div>
        <Link to="/search" className="btn btn-primary">Browse More Books</Link>
      </div>

      <div className="tabs">
        {['', 'pending', 'issued', 'returned', 'overdue'].map(s => (
          <button key={s} className={`tab ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}>
            {s || 'All'} {s === '' ? `(${borrows.length})` : ''}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner-container"><div className="spinner"></div></div>
      ) : borrows.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h3>No records found</h3>
          <p>You haven't borrowed any books{filter ? ` with status "${filter}"` : ' yet'}</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Status</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Return Date</th>
                  <th>Fine</th>
                  <th>Renewals</th>
                </tr>
              </thead>
              <tbody>
                {borrows.map(borrow => {
                  const days = daysUntil(borrow.dueDate);
                  const isOverdue = borrow.status === 'issued' && days < 0;
                  return (
                    <tr key={borrow._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 36, height: 48, background: 'var(--bg-tertiary)',
                            borderRadius: 4, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: 16, flexShrink: 0
                          }}>
                            {borrow.book?.coverImage ? (
                              <img src={borrow.book.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
                            ) : '📕'}
                          </div>
                          <div>
                            <Link to={`/book/${borrow.book?._id}`} style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>
                              {borrow.book?.title}
                            </Link>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{borrow.book?.author}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${isOverdue ? 'red' : getStatusColor(borrow.status)}`}>
                          {getStatusIcon(isOverdue ? 'overdue' : borrow.status)} {isOverdue ? 'Overdue' : borrow.status}
                        </span>
                      </td>
                      <td>{formatDate(borrow.issueDate)}</td>
                      <td>
                        <span style={{ color: isOverdue ? 'var(--accent-red)' : 'inherit' }}>
                          {formatDate(borrow.dueDate)}
                          {borrow.status === 'issued' && (
                            <div style={{ fontSize: 11, color: isOverdue ? 'var(--accent-red)' : days <= 3 ? 'var(--accent-orange)' : 'var(--text-muted)' }}>
                              {isOverdue ? `${Math.abs(days)} days overdue` : `${days} days left`}
                            </div>
                          )}
                        </span>
                      </td>
                      <td>{formatDate(borrow.returnDate) || '—'}</td>
                      <td>
                        {borrow.fine > 0 ? (
                          <span style={{ color: borrow.fineStatus === 'paid' ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 600 }}>
                            ₹{borrow.fine} ({borrow.fineStatus})
                          </span>
                        ) : '—'}
                      </td>
                      <td>{borrow.renewCount} / {borrow.maxRenewals}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowedBooks;
