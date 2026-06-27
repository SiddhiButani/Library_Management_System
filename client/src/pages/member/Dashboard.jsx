import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { reportAPI } from '../../services/api';
import { formatDate, daysUntil, formatCurrency, getStatusColor, timeAgo } from '../../utils/formatters';
import { FiBookOpen, FiClock, FiDollarSign, FiTrendingUp, FiAlertTriangle, FiArrowRight } from 'react-icons/fi';

const MemberDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await reportAPI.getMemberDashboard();
      setStats(res.data.stats);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.1))',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 120, opacity: 0.05 }}>📚</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 16 }}>
          Here's what's happening with your library account today.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/search" className="btn btn-primary btn-sm">
            Browse Books <FiArrowRight />
          </Link>
          <Link to="/borrowed-books" className="btn btn-outline btn-sm">
            My Books
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-info">
            <h3>Active Borrows</h3>
            <div className="stat-value">{stats?.activeBorrows?.length || 0}</div>
            <span className="stat-change">Currently borrowed books</span>
          </div>
          <div className="stat-icon"><FiBookOpen /></div>
        </div>
        <div className="stat-card orange">
          <div className="stat-info">
            <h3>Pending Requests</h3>
            <div className="stat-value">{stats?.pendingRequests?.length || 0}</div>
            <span className="stat-change">Awaiting admin approval</span>
          </div>
          <div className="stat-icon"><FiClock /></div>
        </div>
        <div className="stat-card red" style={{ '--accent-stat': 'var(--accent-red)' }}>
          <div className="stat-info">
            <h3>Overdue Books</h3>
            <div className="stat-value" style={{ color: 'var(--accent-red)' }}>{stats?.overdueBorrows || 0}</div>
            <span className="stat-change">Books past due date</span>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--accent-red)' }}>
            <FiAlertTriangle />
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-info">
            <h3>Pending Fines</h3>
            <div className="stat-value" style={{ color: stats?.pendingFines > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
              {formatCurrency(stats?.pendingFines)}
            </div>
            <span className="stat-change">{stats?.pendingFineCount || 0} unpaid fines</span>
          </div>
          <div className="stat-icon"><FiDollarSign /></div>
        </div>
      </div>

      <div className="grid-2">
        {/* Active Borrowed Books */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">📖 Currently Borrowed</h3>
            <Link to="/borrowed-books" className="btn btn-ghost btn-sm">View All <FiArrowRight /></Link>
          </div>
          <div className="card-body">
            {stats?.activeBorrows?.length === 0 ? (
              <div className="empty-state" style={{ padding: 30 }}>
                <div className="empty-state-icon">📚</div>
                <h3>No books borrowed</h3>
                <p>Start by browsing our collection</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {stats?.activeBorrows?.slice(0, 5).map(borrow => {
                  const days = daysUntil(borrow.dueDate);
                  const isOverdue = days < 0;
                  return (
                    <div key={borrow._id} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: 14, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
                      border: isOverdue ? '1px solid rgba(239,68,68,0.3)' : '1px solid var(--border-secondary)'
                    }}>
                      <div style={{
                        width: 44, height: 56, background: 'var(--bg-secondary)', borderRadius: 6,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0
                      }}>
                        {borrow.book?.coverImage ? (
                          <img src={borrow.book.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }} />
                        ) : '📕'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {borrow.book?.title}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{borrow.book?.author}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: isOverdue ? 'var(--accent-red)' : days <= 3 ? 'var(--accent-orange)' : 'var(--accent-green)' }}>
                          {isOverdue ? `${Math.abs(days)} days overdue` : `${days} days left`}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Due: {formatDate(borrow.dueDate)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🕐 Recent Activity</h3>
            <Link to="/transaction-history" className="btn btn-ghost btn-sm">View All <FiArrowRight /></Link>
          </div>
          <div className="card-body">
            {stats?.recentActivity?.length === 0 ? (
              <div className="empty-state" style={{ padding: 30 }}>
                <div className="empty-state-icon">📋</div>
                <h3>No activity yet</h3>
                <p>Your recent transactions will appear here</p>
              </div>
            ) : (
              <div className="activity-feed">
                {stats?.recentActivity?.map(item => (
                  <div key={item._id} className="activity-item">
                    <div className={`activity-dot ${getStatusColor(item.status)}`}></div>
                    <div className="activity-content">
                      <p>
                        <strong>{item.book?.title}</strong> — <span className={`badge badge-${getStatusColor(item.status)}`}>{item.status}</span>
                      </p>
                      <div className="activity-time">{timeAgo(item.updatedAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16, marginTop: 24, padding: 24,
        background: 'var(--gradient-card)', border: '1px solid var(--border-secondary)',
        borderRadius: 'var(--radius-lg)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-blue)' }}>{stats?.totalBorrowed || 0}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Total Books Borrowed</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-green)' }}>{stats?.totalReturned || 0}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Books Returned</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-purple)' }}>{user?.membershipType}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Membership Plan</div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
