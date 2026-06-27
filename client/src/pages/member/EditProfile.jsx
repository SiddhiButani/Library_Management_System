import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiSave, FiArrowLeft, FiUpload } from 'react-icons/fi';

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      data.append('address', formData.address);
      if (profileImage) data.append('profileImage', profileImage);

      const res = await userAPI.updateProfile(data);
      updateUser(res.data.user);
      toast.success('Profile updated successfully');
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await userAPI.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      toast.success('Password changed successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Edit Profile</h1>
          <p>Update your personal information and password</p>
        </div>
        <button onClick={() => navigate('/profile')} className="btn btn-outline">
          <FiArrowLeft /> Back to Profile
        </button>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          Profile Information
        </button>
        <button className={`tab ${activeTab === 'password' ? 'active' : ''}`} onClick={() => setActiveTab('password')}>
          Change Password
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="card" style={{ maxWidth: 640 }}>
          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label className="form-label">Profile Photo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="profile-avatar" style={{ width: 64, height: 64, fontSize: 24 }}>
                  {profileImage ? (
                    <img src={URL.createObjectURL(profileImage)} alt="Preview" />
                  ) : user?.profileImage ? (
                    <img src={user.profileImage} alt={user.name} />
                  ) : (
                    user?.name?.[0]?.toUpperCase()
                  )}
                </div>
                <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                  <FiUpload /> Upload Photo
                  <input type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={(e) => setProfileImage(e.target.files[0])} />
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" value={user?.email} disabled
                style={{ opacity: 0.5 }} />
              <span className="form-hint">Email cannot be changed</span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-input" value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number" />
              </div>
              <div className="form-group">
                <label className="form-label">Membership</label>
                <input type="text" className="form-input" value={user?.membershipType}
                  disabled style={{ opacity: 0.5, textTransform: 'capitalize' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea className="form-textarea" value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter your address" rows={3} />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'password' && (
        <div className="card" style={{ maxWidth: 640 }}>
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input type="password" className="form-input" value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                placeholder="Enter current password" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input type="password" className="form-input" value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  placeholder="Min 6 characters" />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input type="password" className="form-input" value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  placeholder="Re-enter new password" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
