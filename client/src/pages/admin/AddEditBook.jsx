import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiSave, FiArrowLeft, FiUpload } from 'react-icons/fi';

const AddEditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [categories, setCategories] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', author: '', isbn: '', category: '', description: '',
    publisher: '', publishedYear: '', edition: '1st', language: 'English',
    pages: '', totalCopies: '', availableCopies: '', type: 'book',
    tags: '', location: { shelf: '', rack: '' }
  });

  useEffect(() => {
    fetchCategories();
    if (isEdit) fetchBook();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await bookAPI.getCategories();
      setCategories(res.data.categories);
    } catch (error) { console.error(error); }
  };

  const fetchBook = async () => {
    try {
      const res = await bookAPI.getBook(id);
      const b = res.data.book;
      setFormData({
        title: b.title, author: b.author, isbn: b.isbn,
        category: b.category?._id || '', description: b.description,
        publisher: b.publisher, publishedYear: b.publishedYear || '',
        edition: b.edition, language: b.language, pages: b.pages || '',
        totalCopies: b.totalCopies, availableCopies: b.availableCopies,
        type: b.type, tags: b.tags?.join(', ') || '',
        location: b.location || { shelf: '', rack: '' }
      });
    } catch (error) { toast.error('Book not found'); navigate('/admin/books'); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      setFormData(f => ({ ...f, location: { ...f.location, [name.split('.')[1]]: value } }));
    } else {
      setFormData(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.isbn || !formData.category || !formData.totalCopies) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'location') {
          data.append('location[shelf]', value.shelf);
          data.append('location[rack]', value.rack);
        } else {
          data.append(key, value);
        }
      });
      if (coverImage) data.append('coverImage', coverImage);

      if (isEdit) {
        await bookAPI.updateBook(id, data);
        toast.success('Book updated successfully');
      } else {
        await bookAPI.addBook(data);
        toast.success('Book added successfully');
      }
      navigate('/admin/books');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>{isEdit ? 'Edit Book' : 'Add New Book'}</h1><p>{isEdit ? 'Update book details' : 'Add a new book to the library'}</p></div>
        <button onClick={() => navigate('/admin/books')} className="btn btn-outline"><FiArrowLeft /> Back</button>
      </div>

      <div className="card" style={{ maxWidth: 800 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Cover Image</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <div style={{ width: 80, height: 100, background: 'var(--bg-tertiary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, overflow: 'hidden' }}>
                {coverImage ? <img src={URL.createObjectURL(coverImage)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📕'}
              </div>
              <div className="btn btn-outline btn-sm"><FiUpload /> Upload Cover</div>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => setCoverImage(e.target.files[0])} />
            </label>
          </div>

          <div className="form-row">
            <div className="form-group"><label className="form-label">Title *</label><input className="form-input" name="title" value={formData.title} onChange={handleChange} placeholder="Book title" required /></div>
            <div className="form-group"><label className="form-label">Author *</label><input className="form-input" name="author" value={formData.author} onChange={handleChange} placeholder="Author name" required /></div>
          </div>

          <div className="form-row">
            <div className="form-group"><label className="form-label">ISBN *</label><input className="form-input" name="isbn" value={formData.isbn} onChange={handleChange} placeholder="978-0-xxx-xxxxx-x" required /></div>
            <div className="form-group"><label className="form-label">Category *</label>
              <select className="form-select" name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" name="description" value={formData.description} onChange={handleChange} placeholder="Book description" rows={4} /></div>

          <div className="form-row">
            <div className="form-group"><label className="form-label">Publisher</label><input className="form-input" name="publisher" value={formData.publisher} onChange={handleChange} placeholder="Publisher name" /></div>
            <div className="form-group"><label className="form-label">Published Year</label><input className="form-input" type="number" name="publishedYear" value={formData.publishedYear} onChange={handleChange} placeholder="2024" /></div>
          </div>

          <div className="form-row">
            <div className="form-group"><label className="form-label">Edition</label><input className="form-input" name="edition" value={formData.edition} onChange={handleChange} /></div>
            <div className="form-group"><label className="form-label">Language</label><input className="form-input" name="language" value={formData.language} onChange={handleChange} /></div>
          </div>

          <div className="form-row">
            <div className="form-group"><label className="form-label">Pages</label><input className="form-input" type="number" name="pages" value={formData.pages} onChange={handleChange} placeholder="0" /></div>
            <div className="form-group"><label className="form-label">Type</label>
              <select className="form-select" name="type" value={formData.type} onChange={handleChange}>
                <option value="book">Book</option>
                <option value="journal">Journal</option>
                <option value="magazine">Magazine</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group"><label className="form-label">Total Copies *</label><input className="form-input" type="number" name="totalCopies" value={formData.totalCopies} onChange={handleChange} placeholder="1" required min="0" /></div>
            {isEdit && <div className="form-group"><label className="form-label">Available Copies</label><input className="form-input" type="number" name="availableCopies" value={formData.availableCopies} onChange={handleChange} min="0" /></div>}
          </div>

          <div className="form-row">
            <div className="form-group"><label className="form-label">Shelf Location</label><input className="form-input" name="location.shelf" value={formData.location.shelf} onChange={handleChange} placeholder="A" /></div>
            <div className="form-group"><label className="form-label">Rack Location</label><input className="form-input" name="location.rack" value={formData.location.rack} onChange={handleChange} placeholder="1" /></div>
          </div>

          <div className="form-group"><label className="form-label">Tags</label><input className="form-input" name="tags" value={formData.tags} onChange={handleChange} placeholder="fiction, classic, bestseller (comma separated)" />
            <span className="form-hint">Separate tags with commas</span>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}><FiSave /> {loading ? 'Saving...' : (isEdit ? 'Update Book' : 'Add Book')}</button>
            <button type="button" onClick={() => navigate('/admin/books')} className="btn btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditBook;
