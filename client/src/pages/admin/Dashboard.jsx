import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportAPI } from '../../services/api';
import { formatCurrency, timeAgo, getStatusColor } from '../../utils/formatters';
import { FiBook, FiUsers, FiBookOpen, FiAlertTriangle, FiDollarSign, FiClock, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await reportAPI.getDashboardStats();
      setStats(res.data.stats);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const trendData = {
    labels: stats?.monthlyTrends?.map(t => months[t._id.month - 1]) || [],
    datasets: [{
      label: 'Borrows', data: stats?.monthlyTrends?.map(t => t.borrows) || [],
      backgroundColor: 'rgba(59, 130, 246, 0.6)', borderColor: '#3b82f6', borderWidth: 2, borderRadius: 6
    }, {
      label: 'Returns', data: stats?.monthlyTrends?.map(t => t.returns) || [],
      backgroundColor: 'rgba(16, 185, 129, 0.6)', borderColor: '#10b981', borderWidth: 2, borderRadius: 6
    }]
  };

  const categoryData = {
    labels: stats?.booksByCategory?.map(c => c.name) || [],
    datasets: [{
      data: stats?.booksByCategory?.map(c => c.count) || [],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#6366f1']
    }]
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#334155', font: { family: 'Inter' } } } },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(226, 232, 240, 0.7)' } },
      y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(226, 232, 240, 0.7)' } }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Admin Dashboard</h1><p>Overview of your library management system</p></div>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue"><div className="stat-info"><h3>Total Books</h3><div className="stat-value">{stats?.totalBooks || 0}</div><span className="stat-change">{stats?.availableCopies}/{stats?.totalCopies} copies available</span></div><div className="stat-icon"><FiBook /></div></div>
        <div className="stat-card green"><div className="stat-info"><h3>Total Members</h3><div className="stat-value">{stats?.totalMembers || 0}</div><span className="stat-change">{stats?.newMembers || 0} new this month</span></div><div className="stat-icon"><FiUsers /></div></div>
        <div className="stat-card purple"><div className="stat-info"><h3>Active Borrows</h3><div className="stat-value">{stats?.totalBorrows || 0}</div><span className="stat-change">{stats?.pendingRequests || 0} pending requests</span></div><div className="stat-icon"><FiBookOpen /></div></div>
        <div className="stat-card orange"><div className="stat-info"><h3>Overdue Books</h3><div className="stat-value">{stats?.totalOverdue || 0}</div><span className="stat-change">Needs attention</span></div><div className="stat-icon"><FiAlertTriangle /></div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="stat-card green">
          <div className="stat-info">
            <h3>Revenue Collected</h3>
            <div className="stat-value">{formatCurrency(stats?.collectedFines)}</div>
            <span className="stat-change">From fine payments</span>
          </div>
          <div className="stat-icon"><FiDollarSign /></div>
        </div>
        <div className="stat-card orange" style={{ '--accent-stat': 'var(--accent-red)' }}>
          <div className="stat-info">
            <h3>Pending Fines</h3>
            <div className="stat-value" style={{ color: 'var(--accent-orange)' }}>{formatCurrency(stats?.pendingFines)}</div>
            <span className="stat-change">Outstanding amount</span>
          </div>
          <div className="stat-icon"><FiClock /></div>
        </div>
      </div>

      <div className="grid-2">
        <div className="chart-container" style={{ height: 350 }}>
          <h3>📊 Monthly Borrow & Return Trends</h3>
          <div style={{ height: 280 }}><Bar data={trendData} options={chartOptions} /></div>
        </div>
        <div className="chart-container" style={{ height: 350 }}>
          <h3>📚 Books by Category</h3>
          <div style={{ height: 280, display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={categoryData} options={{ ...chartOptions, scales: undefined }} />
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <h3 className="card-title">🕐 Recent Activity</h3>
          <Link to="/admin/issue-return" className="btn btn-ghost btn-sm">View All <FiArrowRight /></Link>
        </div>
        <div className="card-body">
          {stats?.recentBorrows?.length === 0 ? (
            <div className="empty-state" style={{ padding: 20 }}><p>No recent activity</p></div>
          ) : (
            <div className="activity-feed">
              {stats?.recentBorrows?.slice(0, 8).map(item => (
                <div key={item._id} className="activity-item">
                  <div className={`activity-dot ${getStatusColor(item.status)}`}></div>
                  <div className="activity-content">
                    <p>
                      <strong>{item.user?.name}</strong> — {item.book?.title} —{' '}
                      <span className={`badge badge-${getStatusColor(item.status)}`}>{item.status}</span>
                    </p>
                    <div className="activity-time">{timeAgo(item.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
