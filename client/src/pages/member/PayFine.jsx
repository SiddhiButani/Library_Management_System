import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fineAPI } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiDollarSign, FiCreditCard } from 'react-icons/fi';

const PayFine = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fine, setFine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [payLoading, setPayLoading] = useState(false);

  useEffect(() => { fetchFine(); }, [id]);

  const fetchFine = async () => {
    try {
      const res = await fineAPI.getMyFines();
      const found = res.data.fines.find(f => f._id === id);
      if (!found || found.status !== 'pending') { toast.error('Fine not found or already paid'); navigate('/fines'); return; }
      setFine(found);
    } catch (error) { toast.error('Error loading fine'); navigate('/fines'); }
    finally { setLoading(false); }
  };

  const handlePay = async () => {
    setPayLoading(true);
    try {
      await fineAPI.payFine(id, { paymentMethod, transactionId: `TXN-${Date.now()}` });
      toast.success('Fine paid successfully!');
      navigate('/fines');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally { setPayLoading(false); }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;
  if (!fine) return null;

  return (
    <div>
      <button onClick={() => navigate('/fines')} className="btn btn-ghost" style={{ marginBottom: 16 }}>
        <FiArrowLeft /> Back to Fines
      </button>

      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div className="card" style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, background: 'rgba(239,68,68,0.15)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px', color: 'var(--accent-red)' }}>
            <FiDollarSign />
          </div>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Pay Fine</h2>
          <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--accent-red)', marginBottom: 8 }}>
            {formatCurrency(fine.amount)}
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>{fine.reason}</p>
          <div style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', textAlign: 'left' }}>
            <div className="profile-field">
              <span className="profile-field-label">Book</span>
              <span className="profile-field-value">{fine.borrowRecord?.book?.title}</span>
            </div>
            <div className="profile-field">
              <span className="profile-field-label">Fine Date</span>
              <span className="profile-field-value">{formatDate(fine.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Select Payment Method</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
              { value: 'upi', label: 'UPI Payment', icon: '📱' },
              { value: 'cash', label: 'Cash at Counter', icon: '💵' },
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

          <button onClick={handlePay} className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={payLoading}>
            <FiCreditCard /> {payLoading ? 'Processing...' : `Pay ${formatCurrency(fine.amount)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayFine;
