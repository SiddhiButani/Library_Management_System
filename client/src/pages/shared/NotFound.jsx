import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiSearch, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  const { user } = useAuth();

  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <Link to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/'} className="btn btn-primary">
          <FiHome /> {user ? 'Go to Dashboard' : 'Go Home'}
        </Link>
        {user ? (
          <Link to="/search" className="btn btn-outline"><FiSearch /> Browse Books</Link>
        ) : (
          <Link to="/login" className="btn btn-outline"><FiArrowLeft /> Login</Link>
        )}
      </div>
    </div>
  );
};

export default NotFound;
