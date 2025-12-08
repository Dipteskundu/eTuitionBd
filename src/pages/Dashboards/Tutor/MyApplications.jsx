import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

const MyApplications = () => {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentApp, setCurrentApp] = useState(null);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/applications/tutor/my-applications`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (response.data.success) {
        setApplications(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/applications/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success('Application withdrawn successfully');
      setApplications(applications.filter(app => app._id !== id));
    } catch (error) {
      toast.error('Failed to withdraw application');
    }
  };

  const openEditModal = (app) => {
    setCurrentApp(app);
    setEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/applications/${currentApp._id}`,
        {
          qualifications: currentApp.qualifications,
          experience: currentApp.experience,
          expectedSalary: currentApp.expectedSalary
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (response.data.success) {
        toast.success('Application updated successfully');
        setEditModalOpen(false);
        fetchApplications(); // Refresh list
      }
    } catch (error) {
      toast.error('Failed to update application');
    }
  };

  const handleEditChange = (e) => {
    setCurrentApp({
      ...currentApp,
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
      <h1 className="text-3xl font-bold mb-8 text-primary">My Applications</h1>

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-base-200 rounded-xl">
          <p className="text-xl text-gray-500 mb-4">You haven't applied to any tuitions yet.</p>
          <Link to="/tuitions" className="btn btn-primary">
            Browse Tuitions
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div key={app._id} className="card bg-base-100 shadow-xl border border-base-200">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <h2 className="card-title text-xl">{app.tuition?.subject}</h2>
                  <div className={`badge ${app.status === 'approved' ? 'badge-success' :
                      app.status === 'rejected' ? 'badge-error' : 'badge-warning'
                    } badge-outline capitalize`}>
                    {app.status}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">Class: {app.tuition?.class}</p>
                <p className="text-gray-600 text-sm">Location: {app.tuition?.location}</p>
                <div className="divider my-2"></div>
                <p className="text-sm"><span className="font-semibold">My Offer:</span> {app.expectedSalary} BDT</p>

                <div className="card-actions justify-end mt-4">
                  <Link to={`/tuitions/${app.tuition?._id}`} className="btn btn-sm btn-ghost" title="View Tuition">
                    <FaEye />
                  </Link>
                  {app.status === 'pending' && (
                    <>
                      <button
                        onClick={() => openEditModal(app)}
                        className="btn btn-sm btn-ghost text-info"
                        title="Edit Application"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(app._id)}
                        className="btn btn-sm btn-ghost text-error"
                        title="Withdraw"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && currentApp && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Edit Application</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="form-control">
                <label className="label">Qualifications</label>
                <textarea name="qualifications" value={currentApp.qualifications} onChange={handleEditChange} className="textarea textarea-bordered h-24" required></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">Experience</label>
                  <input type="text" name="experience" value={currentApp.experience} onChange={handleEditChange} className="input input-bordered" required />
                </div>
                <div className="form-control">
                  <label className="label">Expected Salary</label>
                  <input type="number" name="expectedSalary" value={currentApp.expectedSalary} onChange={handleEditChange} className="input input-bordered" required />
                </div>
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

export default MyApplications;
