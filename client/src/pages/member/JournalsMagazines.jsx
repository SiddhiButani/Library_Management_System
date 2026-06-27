import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookAPI } from '../../services/api';

const JournalsMagazines = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('journal');
  const navigate = useNavigate();

  useEffect(() => { fetchItems(); }, [activeTab]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await bookAPI.getBooks({ type: activeTab, limit: 50 });
      setItems(res.data.books);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Journals & Magazines</h1><p>Browse our collection of academic journals and magazines</p></div>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'journal' ? 'active' : ''}`} onClick={() => setActiveTab('journal')}>
          📰 Journals
        </button>
        <button className={`tab ${activeTab === 'magazine' ? 'active' : ''}`} onClick={() => setActiveTab('magazine')}>
          📓 Magazines
        </button>
      </div>

      {loading ? (
        <div className="spinner-container"><div className="spinner"></div></div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">{activeTab === 'journal' ? '📰' : '📓'}</div>
          <h3>No {activeTab}s found</h3>
          <p>Check back later for new additions</p>
        </div>
      ) : (
        <div className="book-grid">
          {items.map(item => (
            <div key={item._id} className="book-card" onClick={() => navigate(`/book/${item._id}`)}>
              <div className="book-card-cover">
                {item.coverImage ? (
                  <img src={item.coverImage} alt={item.title} />
                ) : (
                  <span>{activeTab === 'journal' ? '📰' : '📓'}</span>
                )}
                <span className="book-card-type">
                  <span className={`badge badge-${activeTab === 'journal' ? 'purple' : 'cyan'}`}>{activeTab}</span>
                </span>
              </div>
              <div className="book-card-info">
                <div className="book-card-title">{item.title}</div>
                <div className="book-card-author">{item.author}</div>
                <div className="book-card-meta">
                  <span className={`book-card-availability ${item.availableCopies > 0 ? 'available' : 'unavailable'}`}>
                    {item.availableCopies > 0 ? `${item.availableCopies} Available` : 'Not Available'}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.publishedYear}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalsMagazines;
