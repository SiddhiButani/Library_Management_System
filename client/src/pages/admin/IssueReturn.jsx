import { useState, useEffect } from 'react';
import { borrowAPI } from '../../services/api';
import { formatDate, daysUntil, getStatusColor } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiCornerDownLeft, FiAlertTriangle } from 'react-icons/fi';

const IssueReturn = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => { fetchData(); }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let res;
      if (activeTab === 'pending') res = await borrowAPI.getPendingRequests();
      else if (activeTab === 'overdue') res = await borrowAPI.getOverdueBooks();
      else res = await borrowAPI.getAllBorrows({ status: activeTab, limit: 50 });
      setRecords(res.data.borrows);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleIssue = async (id) => {
    setActionLoading(id);
    try {
      await borrowAPI.issueBook(id);
      toast.success('Book issued successfully');
      fetchData();
    } catch (error) { toast.error(error.response?.data?.message || 'Issue failed'); }
    finally { setActionLoading(''); }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this request?')) return;
    setActionLoading(id);
    try {
      await borrowAPI.rejectRequest(id, { reason: 'Rejected by admin' });
      toast.success('Request rejected');
      fetchData();
    } catch (error) { toast.error(error.response?.data?.message || 'Reject failed'); }
    finally { setActionLoading(''); }
  };

  const handleReturn = async (id) => {
    setActionLoading(id);
    try {
      const res = await borrowAPI.returnBook(id);
      toast.success(res.data.message);
      fetchData();
    } catch (error) { toast.error(error.response?.data?.message || 'Return failed'); }
    finally { setActionLoading(''); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Issue / Return Management</h1><p>Process book issue requests and returns</p></div>
      </div>

      <div className="tabs">
        {[
          { key: 'pending', label: '⏳ Pending Requests' },
          { key: 'issued', label: '📖 Currently Issued' },
          { key: 'overdue', label: '⚠️ Overdue' },
          { key: 'returned', label: '✅ Returned' }
        ].map(t => (
          <button key={t.key} className={`tab ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {loading ? <div className="spinner-container"><div className="spinner"></div></div> : records.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No {activeTab} records</h3>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Member</th><th>Book</th><th>Status</th>
                  {activeTab !== 'pending' && <><th>Issue Date</th><th>Due Date</th></>}
                  {activeTab === 'returned' && <th>Return Date</th>}
                  <th>Requested</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map(r => {
                  const days = r.dueDate ? daysUntil(r.dueDate) : 0;
                  return (
                    <tr key={r._id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{r.user?.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.user?.email}</div>
                        <span className={`badge badge-${getStatusColor(r.user?.membershipType)}`} style={{ marginTop: 4 }}>{r.user?.membershipType}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{r.book?.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.book?.author} • ISBN: {r.book?.isbn}</div>
                        {activeTab === 'pending' && r.book?.availableCopies !== undefined && (
                          <span style={{ fontSize: 12, color: r.book.availableCopies > 0 ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 600 }}>
                            {r.book.availableCopies} copies available
                          </span>
                        )}
                      </td>
                      <td><span className={`badge badge-${getStatusColor(r.status)}`}>{r.status}</span></td>
                      {activeTab !== 'pending' && (
                        <>
                          <td>{formatDate(r.issueDate)}</td>
                          <td>
                            {formatDate(r.dueDate)}
                            {r.status === 'issued' && days < 0 && (
                              <div style={{ color: 'var(--accent-red)', fontSize: 12, fontWeight: 600 }}>
                                <FiAlertTriangle /> {Math.abs(days)} days overdue
                              </div>
                            )}
                          </td>
                        </>
                      )}
                      {activeTab === 'returned' && <td>{formatDate(r.returnDate)}</td>}
                      <td>{formatDate(r.createdAt)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {activeTab === 'pending' && (
                            <>
                              <button onClick={() => handleIssue(r._id)} className="btn btn-success btn-sm"
                                disabled={actionLoading === r._id}><FiCheck /> Issue</button>
                              <button onClick={() => handleReject(r._id)} className="btn btn-danger btn-sm"
                                disabled={actionLoading === r._id}><FiX /> Reject</button>
                            </>
                          )}
                          {(activeTab === 'issued' || activeTab === 'overdue') && (
                            <button onClick={() => handleReturn(r._id)} className="btn btn-primary btn-sm"
                              disabled={actionLoading === r._id}><FiCornerDownLeft /> Return</button>
                          )}
                        </div>
                      </td>
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

export default IssueReturn;
