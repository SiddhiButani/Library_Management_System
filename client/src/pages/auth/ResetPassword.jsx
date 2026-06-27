import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiLock } from 'react-icons/fi';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await authAPI.resetPassword(token, { password });
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">🔐</div>
          <h1>Reset Password</h1>
          <p>Enter your new password below</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="password" className="form-input" placeholder="Enter new password (min 6 chars)"
                value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingLeft: 40 }} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="password" className="form-input" placeholder="Re-enter new password"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ paddingLeft: 40 }} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <div className="auth-footer">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
