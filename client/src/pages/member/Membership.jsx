import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { settingsAPI } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { FiCheck, FiStar } from 'react-icons/fi';

const Membership = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await settingsAPI.getSettings();
      setSettings(res.data.settings);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleUpgradeNavigation = (planName) => {
    navigate(`/checkout-membership/${planName}`);
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  const hierarchy = { basic: 0, premium: 1, gold: 2 };
  const currentHierarchyValue = hierarchy[user?.membershipType] ?? 0;

  const plans = [
    {
      name: 'basic', color: 'var(--accent-blue)', features: [
        `Borrow up to ${settings?.maxBooks?.basic || 3} books`,
        `${settings?.borrowDuration?.basic || 14} days borrow period`,
        `${settings?.maxRenewals?.basic || 1} renewal per book`,
        'Access to all categories',
        'Online catalog access'
      ]
    },
    {
      name: 'premium', color: 'var(--accent-purple)', featured: true, features: [
        `Borrow up to ${settings?.maxBooks?.premium || 5} books`,
        `${settings?.borrowDuration?.premium || 21} days borrow period`,
        `${settings?.maxRenewals?.premium || 2} renewals per book`,
        'Priority waiting list',
        'Access to journals & magazines',
        'Email notifications'
      ]
    },
    {
      name: 'gold', color: 'var(--accent-orange)', features: [
        `Borrow up to ${settings?.maxBooks?.gold || 10} books`,
        `${settings?.borrowDuration?.gold || 30} days borrow period`,
        `${settings?.maxRenewals?.gold || 3} renewals per book`,
        'VIP priority everything',
        'Access to rare collections',
        'Personal librarian support',
        'Reduced fine rates'
      ]
    }
  ];

  return (
    <div>
      <div className="page-header" style={{ textAlign: 'center', flexDirection: 'column' }}>
        <h1>Membership Plans</h1>
        <p>Choose the plan that suits your reading habits</p>
      </div>

      <div className="membership-grid">
        {plans.map(plan => (
          <div key={plan.name} className={`membership-card ${plan.featured ? 'featured' : ''}`} style={{ borderColor: user?.membershipType === plan.name ? plan.color : undefined }}>
            {user?.membershipType === plan.name && (
              <div style={{
                position: 'absolute', top: 12, left: 12,
                background: plan.color, color: 'white', padding: '4px 12px',
                borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 700
              }}>CURRENT</div>
            )}
            <div style={{ fontSize: 36, marginBottom: 8 }}>
              {plan.name === 'basic' ? '📖' : plan.name === 'premium' ? '⭐' : '👑'}
            </div>
            <h3 style={{ textTransform: 'capitalize' }}>{plan.name}</h3>
            <div className="membership-price" style={{ color: plan.color }}>
              {formatCurrency(settings?.membershipFees?.[plan.name] || 0)}
              <span>/year</span>
            </div>
            <ul className="membership-features">
              {plan.features.map((f, i) => (
                <li key={i}>
                  <FiCheck style={{ color: plan.color, flexShrink: 0 }} /> {f}
                </li>
              ))}
            </ul>
            <button 
              className={`btn ${hierarchy[plan.name] <= currentHierarchyValue ? 'btn-outline' : 'btn-primary'}`}
              style={{ width: '100%', opacity: hierarchy[plan.name] < currentHierarchyValue ? 0.5 : 1 }} 
              disabled={hierarchy[plan.name] <= currentHierarchyValue}
              onClick={() => handleUpgradeNavigation(plan.name)}
            >
              {user?.membershipType === plan.name 
                ? 'Current Plan' 
                : hierarchy[plan.name] < currentHierarchyValue 
                  ? 'Downgrade Unavailable' 
                  : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Membership;
