import { Link } from 'react-router-dom';
import { FiBook, FiUsers, FiSearch, FiClock, FiShield, FiGlobe, FiArrowRight, FiStar, FiCheckCircle } from 'react-icons/fi';

const LandingPage = () => {
  return (
    <div className="public-page">
      {/* Navigation */}
      <nav className="public-nav">
        <Link to="/" className="public-nav-brand">
          <span style={{
            width: 36, height: 36, background: 'var(--gradient-blue)', borderRadius: 'var(--radius-md)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
          }}>📚</span>
          LibraVerse
        </Link>
        <div className="public-nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login" className="btn btn-outline btn-sm" style={{ marginLeft: 8 }}>Login</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Sign Up Free</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: '100px 40px 80px',
        textAlign: 'center',
        background: 'var(--gradient-hero)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', width: 600, height: 600, background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', top: -200, right: -100, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', width: 450, height: 450, background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', bottom: -150, left: -80, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', top: 100, left: '40%', borderRadius: '50%' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px',
            background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)',
            borderRadius: 'var(--radius-full)', fontSize: 13, color: 'var(--accent-blue)',
            fontWeight: 600, marginBottom: 24
          }}>
            <FiStar size={14} /> Modern Library Management for the Digital Age
          </div>

          <h1 style={{
            fontSize: 56, fontWeight: 900, lineHeight: 1.1, marginBottom: 20,
            background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent-blue) 50%, var(--accent-purple) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>
            Your Library,<br />Reimagined.
          </h1>

          <p style={{ fontSize: 19, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 600, margin: '0 auto 36px' }}>
            LibraVerse brings your library into the future with smart book management, seamless borrowing, 
            and powerful analytics — all in one beautiful platform.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ padding: '16px 36px', fontSize: 16 }}>
              Get Started Free <FiArrowRight />
            </Link>
            <Link to="/about" className="btn btn-outline btn-lg" style={{ padding: '16px 36px', fontSize: 16 }}>
              Learn More
            </Link>
          </div>

          {/* Trust bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, marginTop: 48,
            padding: '20px 0', borderTop: '1px solid var(--border-secondary)'
          }}>
            {[
              { value: '10,000+', label: 'Books' },
              { value: '5,000+', label: 'Members' },
              { value: '50,000+', label: 'Borrows' },
              { value: '99.9%', label: 'Uptime' }
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent-blue)' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 40px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
              Everything You Need to Manage a{' '}
              <span style={{ color: 'var(--accent-blue)' }}>Modern Library</span>
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 550, margin: '0 auto' }}>
              From browsing books to managing memberships, LibraVerse handles it all with elegance.
            </p>
          </div>

          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            {[
              { icon: <FiSearch size={26} />, title: 'Smart Book Search', desc: 'Find any book instantly with powerful search and filters across titles, authors, ISBN, and categories.', color: 'var(--accent-blue)' },
              { icon: <FiBook size={26} />, title: 'Seamless Borrowing', desc: 'Request, borrow, renew, and return books with just a click. Track all your transactions effortlessly.', color: 'var(--accent-green)' },
              { icon: <FiClock size={26} />, title: 'Waiting List System', desc: 'Join a queue for popular books and get notified instantly when they become available.', color: 'var(--accent-purple)' },
              { icon: <FiUsers size={26} />, title: 'Membership Tiers', desc: 'Choose from Basic, Premium, or Gold plans with different borrowing limits and benefits.', color: 'var(--accent-orange)' },
              { icon: <FiShield size={26} />, title: 'Admin Control Panel', desc: 'Full control over books, members, fines, settings, and detailed analytics for library administrators.', color: 'var(--accent-pink)' },
              { icon: <FiGlobe size={26} />, title: 'Access From Anywhere', desc: 'Browse the catalog, check availability, and manage your account from any device, anytime.', color: 'var(--accent-cyan)' }
            ].map((f, i) => (
              <div key={i} className="feature-card" style={{ textAlign: 'left', padding: 28 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 'var(--radius-md)',
                  background: `${f.color}15`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: f.color, marginBottom: 16
                }}>{f.icon}</div>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 40px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
              How It <span style={{ color: 'var(--accent-green)' }}>Works</span>
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)' }}>Get started in 3 simple steps</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up for free and choose a membership plan that suits your reading habits.', emoji: '🔐' },
              { step: '02', title: 'Browse & Borrow', desc: 'Search our vast collection, check availability, and request books with one click.', emoji: '📚' },
              { step: '03', title: 'Read & Return', desc: 'Enjoy your books, renew if needed, and return them when done. It\'s that simple!', emoji: '✨' }
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: 'var(--radius-full)', margin: '0 auto 20px',
                  background: 'var(--gradient-card)', border: '2px solid var(--border-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36
                }}>{s.emoji}</div>
                <div style={{
                  position: 'absolute', top: -8, right: 'calc(50% - 52px)', fontSize: 12,
                  fontWeight: 800, color: 'var(--accent-blue)', background: 'rgba(59,130,246,0.15)',
                  padding: '2px 10px', borderRadius: 'var(--radius-full)'
                }}>STEP {s.step}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Plans Preview */}
      <section style={{ padding: '80px 40px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
              Membership <span style={{ color: 'var(--accent-purple)' }}>Plans</span>
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)' }}>Choose the plan that fits your reading lifestyle</p>
          </div>

          <div className="membership-grid">
            {[
              {
                name: 'Basic', emoji: '📖', price: 'Free', color: 'var(--accent-blue)',
                features: ['Borrow up to 3 books', '14 days borrow period', '1 renewal per book', 'Access all categories', 'Online catalog']
              },
              {
                name: 'Premium', emoji: '⭐', price: '₹499', color: 'var(--accent-purple)', featured: true,
                features: ['Borrow up to 5 books', '21 days borrow period', '2 renewals per book', 'Priority waiting list', 'Journals & magazines']
              },
              {
                name: 'Gold', emoji: '👑', price: '₹999', color: 'var(--accent-orange)',
                features: ['Borrow up to 10 books', '30 days borrow period', '3 renewals per book', 'VIP priority everything', 'Reduced fine rates']
              }
            ].map((plan, i) => (
              <div key={i} className={`membership-card ${plan.featured ? 'featured' : ''}`}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>{plan.emoji}</div>
                <h3>{plan.name}</h3>
                <div className="membership-price" style={{ color: plan.color }}>
                  {plan.price}
                  <span>/year</span>
                </div>
                <ul className="membership-features">
                  {plan.features.map((f, j) => (
                    <li key={j}><FiCheckCircle style={{ color: plan.color, flexShrink: 0 }} /> {f}</li>
                  ))}
                </ul>
                <Link to="/register" className="btn btn-primary" style={{ width: '100%' }}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial / CTA */}
      <section style={{ padding: '80px 40px' }}>
        <div style={{
          maxWidth: 800, margin: '0 auto', textAlign: 'center',
          padding: '48px', background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.08))',
          border: '1px solid rgba(59,130,246,0.2)', borderRadius: 'var(--radius-xl)'
        }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>
            Ready to Transform Your Library Experience?
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>
            Join thousands of readers who've made LibraVerse their go-to library platform. 
            Sign up today and start your reading journey!
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ padding: '14px 32px' }}>
              Create Free Account <FiArrowRight />
            </Link>
            <Link to="/contact" className="btn btn-outline btn-lg" style={{ padding: '14px 32px' }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '48px 40px 24px', background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-secondary)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{
                  width: 36, height: 36, background: 'var(--gradient-blue)', borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
                }}>📚</span>
                <span style={{ fontSize: 20, fontWeight: 700, background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>LibraVerse</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Your modern digital library companion. Empowering knowledge through technology.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--text-secondary)' }}>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link to="/" style={{ fontSize: 13, color: 'var(--text-muted)' }}>Home</Link>
                <Link to="/about" style={{ fontSize: 13, color: 'var(--text-muted)' }}>About Us</Link>
                <Link to="/contact" style={{ fontSize: 13, color: 'var(--text-muted)' }}>Contact Us</Link>
                <Link to="/login" style={{ fontSize: 13, color: 'var(--text-muted)' }}>Login</Link>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--text-secondary)' }}>Features</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Book Catalog</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Borrow & Return</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Membership Plans</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Smart Search</span>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--text-secondary)' }}>Contact</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--text-muted)' }}>
                <span>📍 123 Library Street, Book City</span>
                <span>📧 library@example.com</span>
                <span>📞 +1 234 567 890</span>
                <span>🕐 Mon-Sat: 9AM - 8PM</span>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid var(--border-secondary)', paddingTop: 20,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontSize: 13, color: 'var(--text-muted)'
          }}>
            <span>© 2026 LibraVerse. All rights reserved.</span>
            <div style={{ display: 'flex', gap: 20 }}>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
