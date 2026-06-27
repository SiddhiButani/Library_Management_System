import { useState, useEffect } from 'react';
import { fineAPI } from '../../services/api';
import { formatDate, formatCurrency, getStatusColor } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { FiDollarSign, FiCheckCircle, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';

const FineManagement = () => {
  const [fines, setFines] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  useEffect(() => { fetchFines(); fetchStats(); }, [filter, pagination.page]);

  const fetchFines = async () => {
    setLoading(true);
    try {
      const res = await fineAPI.getAllFines({ status: filter, page: pagination.page, limit: 10 });
      setFines(res.data.fines);
      setPagination(res.data.pagination);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const fetchStats = async () => {
    try {
      const res = await fineAPI.getFineStats();
      setStats(res.data.stats);
    } catch (error) { console.error(error); }
  };

  const handleWaive = async (id) => {
    const reason = prompt('Reason for waiving this fine:');
    if (!reason) return;
    try {
      await fineAPI.waiveFine(id, { reason });
      toast.success('Fine waived');
      fetchFines();
      fetchStats();
    } catch (error) { toast.error(error.response?.data?.message || 'Failed'); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Fine Management</h1><p>Manage and track all library fines</p></div>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card blue"><div className="stat-info"><h3>Total Fines</h3><div className="stat-value">{formatCurrency(stats.totalAmount)}</div><span className="stat-change">{stats.totalFines} total fines</span></div><div className="stat-icon"><FiDollarSign /></div></div>
          <div className="stat-card green"><div className="stat-info"><h3>Collected</h3><div className="stat-value">{formatCurrency(stats.collectedAmount)}</div><span className="stat-change">{stats.paidFines} paid fines</span></div><div className="stat-icon"><FiCheckCircle /></div></div>
          <div className="stat-card orange"><div className="stat-info"><h3>Pending</h3><div className="stat-value">{formatCurrency(stats.pendingAmount)}</div><span className="stat-change">{stats.pendingFines} pending fines</span></div><div className="stat-icon"><FiAlertCircle /></div></div>
          <div className="stat-card purple"><div className="stat-info"><h3>Waived</h3><div className="stat-value">{stats.waivedFines}</div><span className="stat-change">Fines waived by admin</span></div><div className="stat-icon"><FiTrendingUp /></div></div>
        </div>
      )}

      <div className="table-container">
        <div className="table-header">
          <h3>Fine Records</h3>
          <select className="form-select" style={{ width: 'auto', padding: '8px 14px', fontSize: 13 }}
            value={filter} onChange={(e) => { setFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="waived">Waived</option>
          </select>
        </div>

        {loading ? <div className="spinner-container"><div className="spinner"></div></div> : fines.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">💰</div><h3>No fines found</h3></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Member</th><th>Book</th><th>Amount</th><th>Reason</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {fines.map(fine => (
                  <tr key={fine._id}>
                    <td><div style={{ fontWeight: 600 }}>{fine.user?.name}</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{fine.user?.email}</div></td>
                    <td>{fine.borrowRecord?.book?.title || 'N/A'}</td>
                    <td style={{ fontWeight: 700, color: fine.status === 'pending' ? 'var(--accent-red)' : 'var(--accent-green)' }}>{formatCurrency(fine.amount)}</td>
                    <td style={{ fontSize: 13 }}>{fine.reason}</td>
                    <td><span className={`badge badge-${getStatusColor(fine.status)}`}>{fine.status}</span></td>
                    <td>{formatDate(fine.createdAt)}</td>
                    <td>
                      {fine.status === 'pending' && (
                        <button onClick={() => handleWaive(fine._id)} className="btn btn-warning btn-sm">Waive</button>
                      )}
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

export default FineManagement;
