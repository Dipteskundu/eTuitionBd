import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaTrash, FaUserEdit, FaUserShield } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';

const UserManagement = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/users/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success('User deleted successfully');
      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setRoleModalOpen(true);
  };

  const handleRoleUpdate = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/${selectedUser._id}/role`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success('User role updated successfully');
        setUsers(users.map(u => u._id === selectedUser._id ? { ...u, role: newRole } : u));
        setRoleModalOpen(false);
      }
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  if (loading) {
    return (
      <div className="page-container section-padding text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="page-container section-padding">
      <h1 className="text-3xl font-bold mb-8 text-primary">User Management</h1>

      <div className="overflow-x-auto bg-base-100 shadow-xl rounded-xl border border-base-200">
        <table className="table w-full">
          <thead className="bg-base-200">
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-10 h-10">
                        <img src={user.photoURL || "https://via.placeholder.com/150"} alt={user.name} />
                      </div>
                    </div>
                    <div className="font-bold">{user.name}</div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.role === 'admin' ? 'badge-error' :
                      user.role === 'tutor' ? 'badge-primary' : 'badge-ghost'
                    } badge-outline capitalize`}>
                    {user.role}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openRoleModal(user)}
                      className="btn btn-sm btn-ghost text-info"
                      title="Change Role"
                    >
                      <FaUserShield />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="btn btn-sm btn-ghost text-error"
                      title="Delete User"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Change Modal */}
      {roleModalOpen && selectedUser && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Change Role for {selectedUser.name}</h3>
            <div className="form-control">
              <label className="label">Select Role</label>
              <select
                className="select select-bordered w-full"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="tutor">Tutor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setRoleModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleRoleUpdate}>Update Role</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
