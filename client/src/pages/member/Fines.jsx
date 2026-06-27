import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fineAPI } from '../../services/api';
import { formatDate, formatCurrency, getStatusColor } from '../../utils/formatters';
import { FiDollarSign, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const Fines = () => {
  const [fines, setFines] = useState([]);
  const [totalPending, setTotalPending] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchFines(); }, []);

  const fetchFines = async () => {
    try {
      const res = await fineAPI.getMyFines();
      setFines(res.data.fines);
      setTotalPending(res.data.totalPending);
      setTotalPaid(res.data.totalPaid);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1>My Fines</h1><p>View and manage your library fines</p></div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card orange">
          <div className="stat-info">
            <h3>Pending Fines</h3>
            <div className="stat-value">{formatCurrency(totalPending)}</div>
          </div>
          <div className="stat-icon"><FiAlertCircle /></div>
        </div>
        <div className="stat-card green">
          <div className="stat-info">
            <h3>Total Paid</h3>
            <div className="stat-value">{formatCurrency(totalPaid)}</div>
          </div>
          <div className="stat-icon"><FiCheckCircle /></div>
        </div>
        <div className="stat-card blue">
          <div className="stat-info">
            <h3>Total Fines</h3>
            <div className="stat-value">{fines.length}</div>
          </div>
          <div className="stat-icon"><FiDollarSign /></div>
        </div>
      </div>

      {fines.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎉</div>
          <h3>No fines!</h3>
          <p>You don't have any fines. Keep up the good work!</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Book</th><th>Amount</th><th>Reason</th><th>Status</th><th>Date</th><th>Action</th></tr>
              </thead>
              <tbody>
                {fines.map(fine => (
                  <tr key={fine._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{fine.borrowRecord?.book?.title || 'N/A'}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{fine.borrowRecord?.book?.author}</div>
                    </td>
                    <td style={{ fontWeight: 700, color: fine.status === 'pending' ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                      {formatCurrency(fine.amount)}
                    </td>
                    <td style={{ fontSize: 13 }}>{fine.reason}</td>
                    <td><span className={`badge badge-${getStatusColor(fine.status)}`}>{fine.status}</span></td>
                    <td>{formatDate(fine.createdAt)}</td>
                    <td>
                      {fine.status === 'pending' ? (
                        <Link to={`/pay-fine/${fine._id}`} className="btn btn-primary btn-sm">Pay Now</Link>
                      ) : (
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                          {fine.status === 'paid' ? `Paid on ${formatDate(fine.paidDate)}` : 'Waived'}
                        </span>
                      )}
                    </td>
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

export default Fines;
