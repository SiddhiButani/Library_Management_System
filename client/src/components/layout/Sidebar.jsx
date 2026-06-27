import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/formatters';
import {
  FiHome, FiBook, FiUsers, FiSettings, FiBarChart2,
  FiBookOpen, FiClock, FiDollarSign, FiList, FiSearch,
  FiUser, FiEdit, FiLayers, FiMail, FiInfo, FiPhone,
  FiLogOut, FiMenu, FiX, FiGrid, FiFileText, FiStar,
  FiArrowLeftCircle, FiCheckCircle, FiTag
} from 'react-icons/fi';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';

  const memberLinks = [
    { section: 'Main' },
    { path: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
    { path: '/search', label: 'Search Books', icon: <FiSearch /> },
    { path: '/categories', label: 'Book Categories', icon: <FiTag /> },
    { path: '/journals', label: 'Journals & Magazines', icon: <FiFileText /> },
    { section: 'My Library' },
    { path: '/borrowed-books', label: 'Borrowed Books', icon: <FiBookOpen /> },
    { path: '/return-renew', label: 'Return / Renew', icon: <FiArrowLeftCircle /> },
    { path: '/waiting-list', label: 'Waiting List', icon: <FiClock /> },
    { path: '/transaction-history', label: 'Transaction History', icon: <FiList /> },
    { section: 'Finance' },
    { path: '/fines', label: 'My Fines', icon: <FiDollarSign /> },
    { section: 'Account' },
    { path: '/profile', label: 'Profile', icon: <FiUser /> },
    { path: '/membership', label: 'Membership', icon: <FiStar /> },
    { section: 'Help' },
    { path: '/about', label: 'About Us', icon: <FiInfo /> },
    { path: '/contact', label: 'Contact Us', icon: <FiPhone /> }
  ];

  const adminLinks = [
    { section: 'Dashboard' },
    { path: '/admin/dashboard', label: 'Dashboard', icon: <FiGrid /> },
    { section: 'Management' },
    { path: '/admin/books', label: 'Book Management', icon: <FiBook /> },
    { path: '/admin/categories', label: 'Categories', icon: <FiTag /> },
    { path: '/admin/members', label: 'Member Management', icon: <FiUsers /> },
    { path: '/admin/issue-return', label: 'Issue / Return', icon: <FiCheckCircle /> },
    { path: '/admin/fines', label: 'Fine Management', icon: <FiDollarSign /> },
    { section: 'Analytics' },
    { path: '/admin/reports', label: 'Reports', icon: <FiBarChart2 /> },
    { section: 'System' },
    { path: '/admin/messages', label: 'Contact Messages', icon: <FiMail /> },
    { path: '/admin/settings', label: 'Settings', icon: <FiSettings /> },
    { section: 'Account' },
    { path: '/profile', label: 'Profile', icon: <FiUser /> },
    { path: '/about', label: 'About Us', icon: <FiInfo /> }
  ];

  const links = isAdmin ? adminLinks : memberLinks;

  return (
    <>
      <button
        className="menu-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          position: 'fixed',
          top: '18px',
          left: '16px',
          zIndex: 200,
          display: 'none'
        }}
      >
        {mobileOpen ? <FiX /> : <FiMenu />}
      </button>

      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99,
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">📚</div>
          <h2>LibraVerse</h2>
        </div>

        <nav className="sidebar-nav">
          {links.map((item, idx) => {
            if (item.section) {
              return (
                <div key={idx} className="sidebar-section-title">
                  {item.section}
                </div>
              );
            }
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
                onClick={() => setMobileOpen(false)}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div
            className="sidebar-link"
            onClick={handleLogout}
            style={{ marginTop: 'auto', color: 'var(--accent-red)' }}
          >
            <span className="sidebar-link-icon"><FiLogOut /></span>
            <span>Logout</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.name} />
              ) : (
                getInitials(user?.name)
              )}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-role">{user?.role}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
