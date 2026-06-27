import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email'); return; }
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      setSent(true);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">🔑</div>
          <h1>Forgot Password</h1>
          <p>{sent ? 'Check your email for reset instructions' : 'Enter your email to reset your password'}</p>
        </div>

        {!sent ? (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="email" className="form-input" placeholder="Enter your registered email"
                  value={email} onChange={(e) => setEmail(e.target.value)} style={{ paddingLeft: 40 }} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your inbox and follow the instructions.
            </p>
            <button onClick={() => setSent(false)} className="btn btn-outline">
              Resend Email
            </button>
          </div>
        )}

        <div className="auth-footer">
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <FiArrowLeft /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
