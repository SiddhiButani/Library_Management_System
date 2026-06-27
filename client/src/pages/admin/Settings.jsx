import { useState, useEffect } from 'react';
import { settingsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiSave } from 'react-icons/fi';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await settingsAPI.getSettings();
      setSettings(res.data.settings);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleChange = (path, value) => {
    setSettings(prev => {
      const updated = { ...prev };
      const keys = path.split('.');
      if (keys.length === 1) {
        updated[keys[0]] = value;
      } else {
        updated[keys[0]] = { ...updated[keys[0]], [keys[1]]: value };
      }
      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsAPI.updateSettings(settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1>Library Settings</h1><p>Configure your library management system</p></div>
        <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
          <FiSave /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📚 Library Information</h3>
          <div className="form-group"><label className="form-label">Library Name</label><input className="form-input" value={settings?.libraryName || ''} onChange={e => handleChange('libraryName', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={settings?.libraryEmail || ''} onChange={e => handleChange('libraryEmail', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={settings?.libraryPhone || ''} onChange={e => handleChange('libraryPhone', e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Address</label><textarea className="form-textarea" value={settings?.libraryAddress || ''} onChange={e => handleChange('libraryAddress', e.target.value)} rows={2} /></div>
          <div className="form-group"><label className="form-label">Working Hours</label><input className="form-input" value={settings?.workingHours || ''} onChange={e => handleChange('workingHours', e.target.value)} /></div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>💰 Fine Settings</h3>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Fine Per Day (₹)</label><input type="number" className="form-input" value={settings?.finePerDay || 0} onChange={e => handleChange('finePerDay', Number(e.target.value))} /></div>
            <div className="form-group"><label className="form-label">Max Fine Amount (₹)</label><input type="number" className="form-input" value={settings?.maxFineAmount || 0} onChange={e => handleChange('maxFineAmount', Number(e.target.value))} /></div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📖 Borrow Duration (Days)</h3>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Basic</label><input type="number" className="form-input" value={settings?.borrowDuration?.basic || 14} onChange={e => handleChange('borrowDuration.basic', Number(e.target.value))} /></div>
            <div className="form-group"><label className="form-label">Premium</label><input type="number" className="form-input" value={settings?.borrowDuration?.premium || 21} onChange={e => handleChange('borrowDuration.premium', Number(e.target.value))} /></div>
          </div>
          <div className="form-group"><label className="form-label">Gold</label><input type="number" className="form-input" value={settings?.borrowDuration?.gold || 30} onChange={e => handleChange('borrowDuration.gold', Number(e.target.value))} /></div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📚 Max Books Allowed</h3>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Basic</label><input type="number" className="form-input" value={settings?.maxBooks?.basic || 3} onChange={e => handleChange('maxBooks.basic', Number(e.target.value))} /></div>
            <div className="form-group"><label className="form-label">Premium</label><input type="number" className="form-input" value={settings?.maxBooks?.premium || 5} onChange={e => handleChange('maxBooks.premium', Number(e.target.value))} /></div>
          </div>
          <div className="form-group"><label className="form-label">Gold</label><input type="number" className="form-input" value={settings?.maxBooks?.gold || 10} onChange={e => handleChange('maxBooks.gold', Number(e.target.value))} /></div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>🔄 Max Renewals</h3>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Basic</label><input type="number" className="form-input" value={settings?.maxRenewals?.basic || 1} onChange={e => handleChange('maxRenewals.basic', Number(e.target.value))} /></div>
            <div className="form-group"><label className="form-label">Premium</label><input type="number" className="form-input" value={settings?.maxRenewals?.premium || 2} onChange={e => handleChange('maxRenewals.premium', Number(e.target.value))} /></div>
          </div>
          <div className="form-group"><label className="form-label">Gold</label><input type="number" className="form-input" value={settings?.maxRenewals?.gold || 3} onChange={e => handleChange('maxRenewals.gold', Number(e.target.value))} /></div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>💳 Membership Fees (₹/Year)</h3>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Basic</label><input type="number" className="form-input" value={settings?.membershipFees?.basic || 0} onChange={e => handleChange('membershipFees.basic', Number(e.target.value))} /></div>
            <div className="form-group"><label className="form-label">Premium</label><input type="number" className="form-input" value={settings?.membershipFees?.premium || 499} onChange={e => handleChange('membershipFees.premium', Number(e.target.value))} /></div>
          </div>
          <div className="form-group"><label className="form-label">Gold</label><input type="number" className="form-input" value={settings?.membershipFees?.gold || 999} onChange={e => handleChange('membershipFees.gold', Number(e.target.value))} /></div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
