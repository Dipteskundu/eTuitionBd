import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

const MyTuitions = () => {
  const { token } = useAuth();
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentTuition, setCurrentTuition] = useState(null);

  const fetchTuitions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/tuitions/student/my-tuitions`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (response.data.success) {
        setTuitions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching tuitions:', error);
      toast.error('Failed to load tuitions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTuitions();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tuition post?')) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/tuitions/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success('Tuition deleted successfully');
      setTuitions(tuitions.filter(t => t._id !== id));
    } catch (error) {
      toast.error('Failed to delete tuition');
    }
  };

  const openEditModal = (tuition) => {
    setCurrentTuition(tuition);
    setEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/tuitions/${currentTuition._id}`,
        currentTuition,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (response.data.success) {
        toast.success('Tuition updated successfully');
        setEditModalOpen(false);
        fetchTuitions(); // Refresh list
      }
    } catch (error) {
      toast.error('Failed to update tuition');
    }
  };

  const handleEditChange = (e) => {
    setCurrentTuition({
      ...currentTuition,
      [e.target.name]: e.target.value
    });
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">My Tuitions</h1>
        <Link to="/dashboard/student/post-tuition" className="btn btn-primary">
          Post New Tuition
        </Link>
      </div>

      {tuitions.length === 0 ? (
        <div className="text-center py-12 bg-base-200 rounded-xl">
          <p className="text-xl text-gray-500 mb-4">You haven't posted any tuitions yet.</p>
          <Link to="/dashboard/student/post-tuition" className="btn btn-outline btn-primary">
            Post Your First Tuition
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tuitions.map((tuition) => (
            <div key={tuition._id} className="card bg-base-100 shadow-xl border border-base-200">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <h2 className="card-title text-xl">{tuition.subject}</h2>
                  <div className={`badge ${tuition.status === 'approved' ? 'badge-success' :
                      tuition.status === 'rejected' ? 'badge-error' : 'badge-warning'
                    } badge-outline capitalize`}>
                    {tuition.status}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">Class: {tuition.class}</p>
                <p className="text-gray-600 text-sm mb-2">Location: {tuition.location}</p>
                <p className="text-gray-600 text-sm mb-4">Budget: {tuition.budget} BDT</p>

                <div className="card-actions justify-end mt-auto">
                  <Link to={`/tuitions/${tuition._id}`} className="btn btn-sm btn-ghost" title="View">
                    <FaEye />
                  </Link>
                  <button
                    onClick={() => openEditModal(tuition)}
                    className="btn btn-sm btn-ghost text-info"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(tuition._id)}
                    className="btn btn-sm btn-ghost text-error"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && currentTuition && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Edit Tuition</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">Subject</label>
                  <input type="text" name="subject" value={currentTuition.subject} onChange={handleEditChange} className="input input-bordered" required />
                </div>
                <div className="form-control">
                  <label className="label">Class</label>
                  <input type="text" name="class" value={currentTuition.class} onChange={handleEditChange} className="input input-bordered" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">Location</label>
                  <input type="text" name="location" value={currentTuition.location} onChange={handleEditChange} className="input input-bordered" required />
                </div>
                <div className="form-control">
                  <label className="label">Budget</label>
                  <input type="number" name="budget" value={currentTuition.budget} onChange={handleEditChange} className="input input-bordered" required />
                </div>
              </div>
              <div className="form-control">
                <label className="label">Schedule</label>
                <input type="text" name="schedule" value={currentTuition.schedule} onChange={handleEditChange} className="input input-bordered" required />
              </div>
              <div className="form-control">
                <label className="label">Description</label>
                <textarea name="description" value={currentTuition.description} onChange={handleEditChange} className="textarea textarea-bordered h-24" required></textarea>
              </div>
              <div className="modal-action">
                <button type="button" className="btn" onClick={() => setEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTuitions;
