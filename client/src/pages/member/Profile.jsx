import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatDate, getInitials, getStatusColor } from '../../utils/formatters';
import { FiEdit2, FiMail, FiPhone, FiMapPin, FiCalendar, FiStar, FiShield } from 'react-icons/fi';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p>View and manage your account information</p>
        </div>
        <Link to="/edit-profile" className="btn btn-primary">
          <FiEdit2 /> Edit Profile
        </Link>
      </div>

      <div className="profile-header">
        <div className="profile-avatar">
          {user?.profileImage ? (
            <img src={user.profileImage} alt={user.name} />
          ) : (
            getInitials(user?.name)
          )}
        </div>
        <div className="profile-info">
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <span className={`badge badge-${getStatusColor(user?.membershipType)}`}>
              <FiStar style={{ marginRight: 4 }} /> {user?.membershipType} Member
            </span>
            <span className={`badge badge-${user?.isActive ? 'green' : 'red'}`}>
              {user?.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      <div className="profile-details">
        <div className="profile-detail-card">
          <h3>Personal Information</h3>
          <div className="profile-field">
            <span className="profile-field-label"><FiMail style={{ marginRight: 6 }} />Email</span>
            <span className="profile-field-value">{user?.email}</span>
          </div>
          <div className="profile-field">
            <span className="profile-field-label"><FiPhone style={{ marginRight: 6 }} />Phone</span>
            <span className="profile-field-value">{user?.phone || 'Not provided'}</span>
          </div>
          <div className="profile-field">
            <span className="profile-field-label"><FiMapPin style={{ marginRight: 6 }} />Address</span>
            <span className="profile-field-value">{user?.address || 'Not provided'}</span>
          </div>
          <div className="profile-field">
            <span className="profile-field-label"><FiShield style={{ marginRight: 6 }} />Role</span>
            <span className="profile-field-value" style={{ textTransform: 'capitalize' }}>{user?.role}</span>
          </div>
        </div>

        <div className="profile-detail-card">
          <h3>Membership Details</h3>
          <div className="profile-field">
            <span className="profile-field-label">Plan</span>
            <span className="profile-field-value" style={{ textTransform: 'capitalize' }}>{user?.membershipType}</span>
          </div>
          <div className="profile-field">
            <span className="profile-field-label">Expiry Date</span>
            <span className="profile-field-value">{formatDate(user?.membershipExpiry)}</span>
          </div>
          <div className="profile-field">
            <span className="profile-field-label">Member Since</span>
            <span className="profile-field-value">{formatDate(user?.createdAt)}</span>
          </div>
          <div className="profile-field">
            <span className="profile-field-label">Last Login</span>
            <span className="profile-field-value">{formatDate(user?.lastLogin)}</span>
          </div>
        </div>

        <div className="profile-detail-card">
          <h3>Account Security</h3>
          <div className="profile-field">
            <span className="profile-field-label">Password</span>
            <span className="profile-field-value">••••••••</span>
          </div>
          <Link to="/edit-profile" className="btn btn-outline btn-sm" style={{ marginTop: 12 }}>
            Change Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
