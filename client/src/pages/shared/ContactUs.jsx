import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { contactAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiSend, FiMail, FiMapPin, FiPhone, FiClock } from 'react-icons/fi';

const ContactUs = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await contactAPI.submitMessage(formData);
      toast.success('Message sent successfully!');
      setFormData({ name: user?.name || '', email: user?.email || '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message');
    } finally { setLoading(false); }
  };

  const content = (
    <div>
      {!user && (
        <nav className="public-nav">
          <Link to="/" className="public-nav-brand">📚 LibraVerse</Link>
          <div className="public-nav-links">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
          </div>
        </nav>
      )}

      <div className={!user ? 'hero-section' : ''} style={user ? { marginBottom: 32 } : {}}>
        <h1 style={user ? { fontSize: 32, fontWeight: 800, marginBottom: 8 } : {}}>Contact Us</h1>
        <p style={user ? { color: 'var(--text-muted)', fontSize: 16 } : {}}>We'd love to hear from you. Reach out anytime!</p>
      </div>

      <div className={!user ? 'content-section' : ''}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, maxWidth: 1000, margin: '0 auto' }}>
          {/* Contact Form */}
          <div className="card">
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Send us a Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Name</label>
                  <input className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Your name" /></div>
                <div className="form-group"><label className="form-label">Email</label>
                  <input type="email" className="form-input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="Your email" /></div>
              </div>
              <div className="form-group"><label className="form-label">Subject</label>
                <input className="form-input" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} placeholder="Message subject" /></div>
              <div className="form-group"><label className="form-label">Message</label>
                <textarea className="form-textarea" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder="Write your message here..." rows={5} /></div>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                <FiSend /> {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <div className="card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Contact Information</h3>
              {[
                { icon: <FiMapPin />, label: 'Address', value: '123 Library Street, Book City, BC 12345' },
                { icon: <FiMail />, label: 'Email', value: 'library@example.com' },
                { icon: <FiPhone />, label: 'Phone', value: '+1 234 567 890' },
                { icon: <FiClock />, label: 'Hours', value: 'Mon-Sat: 9:00 AM - 8:00 PM\nSun: 10:00 AM - 5:00 PM' }
              ].map((info, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: i < 3 ? '1px solid var(--border-secondary)' : 'none' }}>
                  <div style={{ width: 40, height: 40, background: 'rgba(59,130,246,0.1)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)', flexShrink: 0 }}>
                    {info.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{info.label}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', whiteSpace: 'pre-line' }}>{info.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', borderColor: 'rgba(59,130,246,0.2)' }}>
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>📌 Quick Help</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                For account-related issues, please include your registered email address in the message. 
                For book requests, please provide the ISBN or title. We typically respond within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return user ? <div>{content}</div> : <div className="public-page">{content}</div>;
};

export default ContactUs;
