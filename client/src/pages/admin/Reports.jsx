import { useState, useEffect } from 'react';
import { reportAPI, borrowAPI, bookAPI, userAPI } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

const Reports = () => {
  const [dashStats, setDashStats] = useState(null);
  const [borrowStats, setBorrowStats] = useState(null);
  const [bookStats, setBookStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [dash, borrows, books, users] = await Promise.all([
        reportAPI.getDashboardStats(),
        borrowAPI.getBorrowStats(),
        bookAPI.getBookStats(),
        userAPI.getUserStats()
      ]);
      setDashStats(dash.data.stats);
      setBorrowStats(borrows.data.stats);
      setBookStats(books.data.stats);
      setUserStats(users.data.stats);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartBase = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#334155', font: { family: 'Inter' } } } },
    scales: { x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(226, 232, 240, 0.7)' } }, y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(226, 232, 240, 0.7)' } } }
  };

  return (
    <div>
      <div className="page-header"><div><h1>Reports & Analytics</h1><p>Detailed insights into your library operations</p></div></div>

      {/* Summary */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        <div className="stat-card blue"><div className="stat-info"><h3>Books</h3><div className="stat-value">{bookStats?.totalBooks}</div></div></div>
        <div className="stat-card green"><div className="stat-info"><h3>Members</h3><div className="stat-value">{userStats?.totalMembers}</div></div></div>
        <div className="stat-card purple"><div className="stat-info"><h3>Issued</h3><div className="stat-value">{borrowStats?.totalIssued}</div></div></div>
        <div className="stat-card orange"><div className="stat-info"><h3>Overdue</h3><div className="stat-value">{borrowStats?.totalOverdue}</div></div></div>
        <div className="stat-card green"><div className="stat-info"><h3>Revenue</h3><div className="stat-value">{formatCurrency(dashStats?.collectedFines)}</div></div></div>
      </div>

      <div className="grid-2">
        {/* Monthly Borrows */}
        <div className="chart-container" style={{ height: 350 }}>
          <h3>📈 Borrow Trends (6 Months)</h3>
          <div style={{ height: 280 }}>
            <Line data={{
              labels: borrowStats?.monthlyBorrows?.map(m => months[m._id.month - 1]) || [],
              datasets: [{
                label: 'Borrows', data: borrowStats?.monthlyBorrows?.map(m => m.count) || [],
                borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.4
              }]
            }} options={chartBase} />
          </div>
        </div>

        {/* Books by Type */}
        <div className="chart-container" style={{ height: 350 }}>
          <h3>📊 Collection by Type</h3>
          <div style={{ height: 280, display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={{
              labels: bookStats?.byType?.map(t => t._id) || [],
              datasets: [{ data: bookStats?.byType?.map(t => t.count) || [], backgroundColor: ['#3b82f6', '#8b5cf6', '#06b6d4'] }]
            }} options={{ ...chartBase, scales: undefined }} />
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 24 }}>
        {/* Popular Books */}
        <div className="card">
          <div className="card-header"><h3 className="card-title">🏆 Most Borrowed Books</h3></div>
          <div className="card-body">
            {borrowStats?.popularBooks?.slice(0, 8).map((book, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-secondary)' }}>
                <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-full)', background: i < 3 ? 'var(--gradient-blue)' : 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{book.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{book.author}</div>
                </div>
                <span className="badge badge-blue">{book.borrowCount} borrows</span>
              </div>
            ))}
          </div>
        </div>

        {/* Membership Distribution */}
        <div className="card">
          <div className="card-header"><h3 className="card-title">👥 Membership Distribution</h3></div>
          <div className="card-body">
            {userStats?.membershipBreakdown?.map(m => (
              <div key={m._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border-secondary)' }}>
                <span style={{ fontSize: 24 }}>{m._id === 'basic' ? '📖' : m._id === 'premium' ? '⭐' : '👑'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{m._id}</div>
                  <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, marginTop: 6 }}>
                    <div style={{ height: '100%', borderRadius: 3, background: m._id === 'basic' ? 'var(--accent-blue)' : m._id === 'premium' ? 'var(--accent-purple)' : 'var(--accent-orange)', width: `${(m.count / userStats.totalMembers) * 100}%` }}></div>
                  </div>
                </div>
                <span style={{ fontWeight: 700, fontSize: 18 }}>{m.count}</span>
              </div>
            ))}
            <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>Active: {userStats?.activeMembers} | Inactive: {userStats?.inactiveMembers} | New this month: {userStats?.newMembersThisMonth}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
