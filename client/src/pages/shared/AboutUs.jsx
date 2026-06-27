import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiBook, FiUsers, FiGlobe, FiAward, FiClock, FiHeart } from 'react-icons/fi';

const AboutUs = () => {
  const { user } = useAuth();

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
        <h1 style={user ? { fontSize: 32, fontWeight: 800, marginBottom: 8 } : {}}>About LibraVerse</h1>
        <p style={user ? { color: 'var(--text-muted)', fontSize: 16 } : {}}>
          Empowering knowledge through technology — Your modern digital library companion
        </p>
      </div>

      <div className={!user ? 'content-section' : ''}>
        <div style={{ maxWidth: 800, margin: '0 auto 40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.8 }}>
            LibraVerse is a state-of-the-art Library Management System designed to revolutionize how libraries operate.
            We combine cutting-edge technology with user-friendly design to make managing and accessing books effortless.
            Our platform serves both librarians and readers, creating a seamless bridge between knowledge and its seekers.
          </p>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Why Choose LibraVerse?</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 32 }}>Everything you need to manage a modern library</p>

        <div className="features-grid">
          {[
            { icon: <FiBook />, title: 'Vast Collection', desc: 'Access thousands of books, journals, and magazines across multiple categories.' },
            { icon: <FiUsers />, title: 'Member Management', desc: 'Flexible membership tiers with customizable borrowing limits and durations.' },
            { icon: <FiGlobe />, title: 'Online Access', desc: 'Search, browse, and request books from anywhere with our web platform.' },
            { icon: <FiAward />, title: 'Smart Analytics', desc: 'Detailed reports and insights to optimize library operations and resources.' },
            { icon: <FiClock />, title: 'Real-Time Tracking', desc: 'Track borrows, returns, fines, and waiting lists in real-time.' },
            { icon: <FiHeart />, title: 'User-Friendly Design', desc: 'Modern, intuitive interface designed for the best user experience.' }
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-card-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 48, padding: 40, background: 'var(--gradient-card)',
          border: '1px solid var(--border-secondary)', borderRadius: 'var(--radius-xl)',
          textAlign: 'center'
        }}>
          <h2 style={{ marginBottom: 24 }}>Our Impact</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {[
              { value: '10,000+', label: 'Books Available' },
              { value: '5,000+', label: 'Active Members' },
              { value: '50,000+', label: 'Books Issued' },
              { value: '12', label: 'Categories' }
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent-blue)', marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <h2 style={{ marginBottom: 8 }}>Our Mission</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.8, maxWidth: 700, margin: '0 auto' }}>
            To democratize access to knowledge by providing a seamless, technology-driven library experience.
            We believe every person deserves easy access to books and learning resources, and we're committed
            to making that vision a reality through innovation and dedication.
          </p>
        </div>
      </div>
    </div>
  );

  return user ? <div>{content}</div> : <div className="public-page">{content}</div>;
};

export default AboutUs;
