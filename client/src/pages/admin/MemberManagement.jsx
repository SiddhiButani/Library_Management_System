import { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import { formatDate, getStatusColor, getInitials } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { FiSearch, FiEdit2, FiUserX, FiUserCheck } from 'react-icons/fi';

const MemberManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('member');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [editUser, setEditUser] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(), 300);
    return () => clearTimeout(timer);
  }, [search, roleFilter, pagination.page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userAPI.getUsers({ search, role: roleFilter, page: pagination.page, limit: 10 });
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleToggleStatus = async (userId, isActive) => {
    try {
      if (isActive) {
        await userAPI.deleteUser(userId);
        toast.success('User deactivated');
      } else {
        await userAPI.updateUser(userId, { isActive: true });
        toast.success('User activated');
      }
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setEditData({ name: user.name, email: user.email, phone: user.phone, role: user.role, membershipType: user.membershipType });
  };

  const handleSaveEdit = async () => {
    try {
      await userAPI.updateUser(editUser._id, editData);
      toast.success('User updated');
      setEditUser(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Member Management</h1><p>Manage library members and their accounts</p></div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>All Users ({pagination.total})</h3>
          <div className="table-actions">
            <input type="text" className="table-search" placeholder="Search by name or email..."
              value={search} onChange={(e) => { setSearch(e.target.value); setPagination(p => ({ ...p, page: 1 })); }} />
            <select className="form-select" style={{ width: 'auto', padding: '8px 14px', fontSize: 13 }}
              value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="member">Members</option>
              <option value="admin">Admins</option>
              <option value="">All</option>
            </select>
          </div>
        </div>

        {loading ? <div className="spinner-container"><div className="spinner"></div></div> : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>User</th><th>Email</th><th>Phone</th><th>Role</th><th>Membership</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: 'white', flexShrink: 0 }}>
                          {getInitials(u.name)}
                        </div>
                        <span style={{ fontWeight: 600 }}>{u.name}</span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>{u.phone || '—'}</td>
                    <td><span className={`badge badge-${u.role === 'admin' ? 'purple' : 'blue'}`}>{u.role}</span></td>
                    <td><span className={`badge badge-${getStatusColor(u.membershipType)}`}>{u.membershipType}</span></td>
                    <td><span className={`badge badge-${u.isActive ? 'green' : 'red'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td>{formatDate(u.createdAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => handleEdit(u)} className="btn btn-ghost btn-icon" title="Edit"><FiEdit2 /></button>
                        <button onClick={() => handleToggleStatus(u._id, u.isActive)} className="btn btn-ghost btn-icon"
                          title={u.isActive ? 'Deactivate' : 'Activate'}
                          style={{ color: u.isActive ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                          {u.isActive ? <FiUserX /> : <FiUserCheck />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="pagination">
            <button className="pagination-btn" disabled={pagination.page === 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}>←</button>
            {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
              const page = i + Math.max(1, pagination.page - 2);
              if (page > pagination.pages) return null;
              return <button key={page} className={`pagination-btn ${pagination.page === page ? 'active' : ''}`} onClick={() => setPagination(p => ({ ...p, page }))}>{page}</button>;
            })}
            <button className="pagination-btn" disabled={pagination.page === pagination.pages} onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}>→</button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="modal-overlay" onClick={() => setEditUser(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit User: {editUser.name}</h3>
              <button className="modal-close" onClick={() => setEditUser(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={editData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })} /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Role</label>
                  <select className="form-select" value={editData.role} onChange={e => setEditData({ ...editData, role: e.target.value })}>
                    <option value="member">Member</option><option value="admin">Admin</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Membership</label>
                  <select className="form-select" value={editData.membershipType} onChange={e => setEditData({ ...editData, membershipType: e.target.value })}>
                    <option value="basic">Basic</option><option value="premium">Premium</option><option value="gold">Gold</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setEditUser(null)} className="btn btn-ghost">Cancel</button>
              <button onClick={handleSaveEdit} className="btn btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;
