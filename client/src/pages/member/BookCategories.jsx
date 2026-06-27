import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookAPI } from '../../services/api';

const BookCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await bookAPI.getCategories();
      setCategories(res.data.categories);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1>Book Categories</h1><p>Browse books organized by category</p></div>
      </div>
      <div className="features-grid">
        {categories.map(cat => (
          <div key={cat._id} className="feature-card" onClick={() => navigate(`/search?category=${cat._id}`)} style={{ cursor: 'pointer' }}>
            <div className="feature-card-icon">{cat.icon || '📚'}</div>
            <h3>{cat.name}</h3>
            <p>{cat.description || 'Explore books in this category'}</p>
            <div style={{ marginTop: 12, fontSize: 14, color: 'var(--accent-blue)', fontWeight: 600 }}>
              {cat.bookCount || 0} Books
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookCategories;
