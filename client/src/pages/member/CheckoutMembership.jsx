import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { settingsAPI, userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiCreditCard, FiAward } from 'react-icons/fi';

const CheckoutMembership = () => {
  const { plan } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [payLoading, setPayLoading] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await settingsAPI.getSettings();
      setSettings(res.data.settings);
    } catch (error) { 
        toast.error('Error loading settings'); 
        navigate('/membership'); 
    }
    finally { setLoading(false); }
  };

  const handlePay = async () => {
    setPayLoading(true);
    try {
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 800));
      const res = await userAPI.upgradeMembership({ plan });
      if (res.data.success) {
        updateUser(res.data.user);
        toast.success(`Payment successful! Upgraded to ${plan} membership.`);
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally { setPayLoading(false); }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;
  if (!settings || !['basic', 'premium', 'gold'].includes(plan)) return null;

  const validPlans = {
      basic: { color: 'var(--accent-blue)', icon: '📖', label: 'Basic' },
      premium: { color: 'var(--accent-purple)', icon: '⭐', label: 'Premium' },
      gold: { color: 'var(--accent-orange)', icon: '👑', label: 'Gold' }
  };

  const selectedPlanInfo = validPlans[plan];
  const price = settings?.membershipFees?.[plan] || 0;

  return (
    <div>
      <button onClick={() => navigate('/membership')} className="btn btn-ghost" style={{ marginBottom: 16 }}>
        <FiArrowLeft /> Back to Plans
      </button>

      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div className="card" style={{ textAlign: 'center', marginBottom: 24, borderTop: `4px solid ${selectedPlanInfo.color}` }}>
          <div style={{ width: 64, height: 64, background: `${selectedPlanInfo.color}20`, borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px', color: selectedPlanInfo.color }}>
            {selectedPlanInfo.icon}
          </div>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Upgrade to {selectedPlanInfo.label}</h2>
          <div style={{ fontSize: 48, fontWeight: 800, color: selectedPlanInfo.color, marginBottom: 8 }}>
            {formatCurrency(price)}
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Valid for 1 year from payment date</p>
          
          <div style={{ padding: 16, background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)', borderRadius: 'var(--radius-md)', textAlign: 'left' }}>
            <div className="profile-field">
              <span className="profile-field-label">Account Name</span>
              <span className="profile-field-value">{user.name}</span>
            </div>
            <div className="profile-field">
              <span className="profile-field-label">Current Plan</span>
              <span className="profile-field-value" style={{ textTransform: 'capitalize' }}>{user.membershipType}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Select Payment Method</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
              { value: 'upi', label: 'UPI Payment', icon: '📱' },
              { value: 'paypal', label: 'PayPal', icon: '🌐' },
              { value: 'online', label: 'Online Banking', icon: '🏦' }
            ].map(method => (
              <div key={method.value} onClick={() => setPaymentMethod(method.value)} style={{
                padding: 16, borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'center',
                border: paymentMethod === method.value ? '2px solid var(--accent-blue)' : '1px solid var(--border-secondary)',
                background: paymentMethod === method.value ? 'rgba(59,130,246,0.1)' : 'transparent',
                transition: 'all var(--transition-fast)'
              }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{method.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{method.label}</div>
              </div>
            ))}
          </div>

          <button onClick={handlePay} className="btn btn-primary btn-lg" style={{ width: '100%', background: selectedPlanInfo.color, borderColor: selectedPlanInfo.color, boxShadow: `0 4px 12px ${selectedPlanInfo.color}40` }} disabled={payLoading}>
            <FiCreditCard /> {payLoading ? 'Processing Request...' : `Confirm & Pay ${formatCurrency(price)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutMembership;
