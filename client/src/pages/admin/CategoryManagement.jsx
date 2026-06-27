import { useState, useEffect } from 'react';
import { bookAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', icon: '📚' });

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await bookAPI.getCategories();
      setCategories(res.data.categories);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!formData.name) { toast.error('Name is required'); return; }
    try {
      if (editCat) {
        await bookAPI.updateCategory(editCat._id, formData);
        toast.success('Category updated');
      } else {
        await bookAPI.addCategory(formData);
        toast.success('Category added');
      }
      setShowModal(false);
      setEditCat(null);
      setFormData({ name: '', description: '', icon: '📚' });
      fetchCategories();
    } catch (error) { toast.error(error.response?.data?.message || 'Failed'); }
  };

  const handleEdit = (cat) => {
    setEditCat(cat);
    setFormData({ name: cat.name, description: cat.description, icon: cat.icon });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await bookAPI.deleteCategory(id);
      toast.success('Category deleted');
      fetchCategories();
    } catch (error) { toast.error(error.response?.data?.message || 'Delete failed'); }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <div><h1>Category Management</h1><p>Manage book categories</p></div>
        <button onClick={() => { setEditCat(null); setFormData({ name: '', description: '', icon: '📚' }); setShowModal(true); }} className="btn btn-primary">
          <FiPlus /> Add Category
        </button>
      </div>

      <div className="features-grid">
        {categories.map(cat => (
          <div key={cat._id} className="feature-card" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 4 }}>
              <button onClick={() => handleEdit(cat)} className="btn btn-ghost btn-icon" style={{ width: 28, height: 28 }}><FiEdit2 size={14} /></button>
              <button onClick={() => handleDelete(cat._id)} className="btn btn-ghost btn-icon" style={{ width: 28, height: 28, color: 'var(--accent-red)' }}><FiTrash2 size={14} /></button>
            </div>
            <div className="feature-card-icon">{cat.icon}</div>
            <h3>{cat.name}</h3>
            <p>{cat.description || 'No description'}</p>
            <div style={{ marginTop: 10, fontSize: 14, color: 'var(--accent-blue)', fontWeight: 600 }}>{cat.bookCount || 0} Books</div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editCat ? 'Edit Category' : 'Add Category'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label className="form-label">Icon (emoji)</label><input className="form-input" value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} placeholder="📚" /></div>
              <div className="form-group"><label className="form-label">Name *</label><input className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Category name" /></div>
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Category description" rows={3} /></div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
              <button onClick={handleSubmit} className="btn btn-primary">{editCat ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
