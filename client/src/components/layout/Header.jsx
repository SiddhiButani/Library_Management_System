import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiBell, FiCheck } from 'react-icons/fi';
import { notificationAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Header = () => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await notificationAPI.getNotifications();
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const toggleDropdown = () => {
    if (!showNotifications) {
      fetchNotifications();
    }
    setShowNotifications(!showNotifications);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/dashboard': 'Member Dashboard',
      '/search': 'Search Books',
      '/categories': 'Book Categories',
      '/journals': 'Journals & Magazines',
      '/borrowed-books': 'Borrowed Books',
      '/return-renew': 'Return / Renew',
      '/waiting-list': 'Waiting List',
      '/transaction-history': 'Transaction History',
      '/fines': 'My Fines',
      '/profile': 'My Profile',
      '/edit-profile': 'Edit Profile',
      '/membership': 'Membership Plans',
      '/about': 'About Us',
      '/contact': 'Contact Us',
      '/book-availability': 'Book Availability',
      '/admin/dashboard': 'Admin Dashboard',
      '/admin/books': 'Book Management',
      '/admin/categories': 'Category Management',
      '/admin/members': 'Member Management',
      '/admin/issue-return': 'Issue / Return',
      '/admin/fines': 'Fine Management',
      '/admin/reports': 'Reports & Analytics',
      '/admin/messages': 'Contact Messages',
      '/admin/settings': 'Library Settings'
    };

    if (path.startsWith('/book/')) return 'Book Details';
    if (path.startsWith('/pay-fine/')) return 'Pay Fine';
    if (path.startsWith('/admin/books/')) return 'Add / Edit Book';

    return titles[path] || 'LibraVerse';
  };

  return (
    <header className="header">
      <div className="header-left">
        <h2 className="header-title">{getPageTitle()}</h2>
      </div>
      <div className="header-right">
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button 
            className="header-btn" 
            title="Notifications"
            onClick={toggleDropdown}
          >
            <FiBell />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '8px',
                height: '8px',
                backgroundColor: 'var(--accent-red)',
                borderRadius: '50%'
              }}></span>
            )}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown" style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '12px',
              width: '320px',
              backgroundColor: 'var(--bg-card)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--border-secondary)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 1000,
              padding: '16px',
              color: 'var(--text-primary)',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border-secondary)', paddingBottom: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600' }}>
                  Notifications {unreadCount > 0 && <span style={{ fontSize: '12px', background: 'rgba(59, 130, 246, 0.2)', padding: '2px 6px', borderRadius: '10px', marginLeft: '6px' }}>{unreadCount} new</span>}
                </h3>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllAsRead} style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiCheck /> Mark all read
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {notifications.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0', fontSize: '13px' }}>
                    No notifications yet
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div 
                      key={notification._id} 
                      onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                      style={{ 
                        fontSize: '13px', 
                        color: 'var(--text-secondary)',
                        padding: '10px',
                        borderRadius: 'var(--radius-sm)',
                        background: notification.isRead ? 'transparent' : 'rgba(59, 130, 246, 0.05)',
                        borderLeft: notification.isRead ? '2px solid transparent' : '2px solid var(--accent-blue)',
                        cursor: notification.isRead ? 'default' : 'pointer',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <p style={{ color: 'var(--text-primary)', fontWeight: notification.isRead ? '500' : '600', margin: 0 }}>
                          {notification.title}
                        </p>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formatDate(notification.createdAt)}</span>
                      </div>
                      <span style={{ display: 'block', lineHeight: '1.4' }}>{notification.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
