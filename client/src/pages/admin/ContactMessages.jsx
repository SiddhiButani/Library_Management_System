import { useState, useEffect } from 'react';
import { contactAPI } from '../../services/api';
import { formatDate, formatDateTime, getStatusColor } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { FiMail, FiEye, FiSend } from 'react-icons/fi';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [reply, setReply] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  useEffect(() => { fetchMessages(); }, [filter, pagination.page]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await contactAPI.getMessages({ status: filter, page: pagination.page, limit: 10 });
      setMessages(res.data.messages);
      setPagination(res.data.pagination);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleView = async (msg) => {
    setSelectedMsg(msg);
    setReply(msg.reply || '');
    if (msg.status === 'unread') {
      await contactAPI.markAsRead(msg._id);
      fetchMessages();
    }
  };

  const handleReply = async () => {
    if (!reply.trim()) { toast.error('Please enter a reply'); return; }
    try {
      await contactAPI.replyMessage(selectedMsg._id, { reply });
      toast.success('Reply sent');
      setSelectedMsg(null);
      fetchMessages();
    } catch (error) { toast.error('Failed to send reply'); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Contact Messages</h1><p>View and respond to messages from users</p></div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Messages ({pagination.total})</h3>
          <select className="form-select" style={{ width: 'auto', padding: '8px 14px', fontSize: 13 }}
            value={filter} onChange={(e) => { setFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}>
            <option value="">All</option><option value="unread">Unread</option><option value="read">Read</option><option value="replied">Replied</option>
          </select>
        </div>

        {loading ? <div className="spinner-container"><div className="spinner"></div></div> : messages.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">📧</div><h3>No messages</h3></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>From</th><th>Subject</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {messages.map(msg => (
                  <tr key={msg._id} style={{ fontWeight: msg.status === 'unread' ? 600 : 400 }}>
                    <td><div style={{ fontWeight: 600 }}>{msg.name}</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{msg.email}</div></td>
                    <td>{msg.subject}</td>
                    <td><span className={`badge badge-${getStatusColor(msg.status)}`}>{msg.status}</span></td>
                    <td>{formatDate(msg.createdAt)}</td>
                    <td><button onClick={() => handleView(msg)} className="btn btn-ghost btn-sm"><FiEye /> View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedMsg && (
        <div className="modal-overlay" onClick={() => setSelectedMsg(null)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📧 {selectedMsg.subject}</h3>
              <button className="modal-close" onClick={() => setSelectedMsg(null)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 14, color: 'var(--text-muted)' }}>
                  <span><strong>From:</strong> {selectedMsg.name} ({selectedMsg.email})</span>
                  <span><strong>Date:</strong> {formatDateTime(selectedMsg.createdAt)}</span>
                </div>
                <div style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                  {selectedMsg.message}
                </div>
              </div>

              {selectedMsg.reply && (
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: 14, marginBottom: 8, color: 'var(--accent-green)' }}>Your Reply:</h4>
                  <div style={{ padding: 16, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-md)', fontSize: 14, lineHeight: 1.7 }}>
                    {selectedMsg.reply}
                  </div>
                </div>
              )}

              {selectedMsg.status !== 'replied' && (
                <div>
                  <label className="form-label">Reply</label>
                  <textarea className="form-textarea" value={reply} onChange={e => setReply(e.target.value)}
                    placeholder="Type your reply here..." rows={4} />
                </div>
              )}
            </div>
            {selectedMsg.status !== 'replied' && (
              <div className="modal-footer">
                <button onClick={() => setSelectedMsg(null)} className="btn btn-ghost">Close</button>
                <button onClick={handleReply} className="btn btn-primary"><FiSend /> Send Reply</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
