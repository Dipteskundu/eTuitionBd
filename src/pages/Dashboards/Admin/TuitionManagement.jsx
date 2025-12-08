import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

const TuitionManagement = () => {
  const { token } = useAuth();
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchTuitions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/tuitions/admin/all${filter !== 'all' ? `?status=${filter}` : ''}`,
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
  }, [token, filter]);

  const handleStatusChange = async (id, status) => {
    try {
      const endpoint = status === 'approved' ? 'approve' : 'reject';
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/tuitions/${id}/${endpoint}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success(`Tuition ${status} successfully`);
        setTuitions(tuitions.map(t => t._id === id ? { ...t, status } : t));
      }
    } catch (error) {
      toast.error(`Failed to ${status} tuition`);
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Tuition Management</h1>
        <select
          className="select select-bordered"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-base-100 shadow-xl rounded-xl border border-base-200">
        <table className="table w-full">
          <thead className="bg-base-200">
            <tr>
              <th>Subject</th>
              <th>Posted By</th>
              <th>Location</th>
              <th>Budget</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tuitions.map((tuition) => (
              <tr key={tuition._id} className="hover">
                <td className="font-bold">{tuition.subject} <br /><span className="text-xs font-normal text-gray-500">{tuition.class}</span></td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-8">
                        <span className="text-xs">{tuition.student?.name?.charAt(0)}</span>
                      </div>
                    </div>
                    <span className="text-sm">{tuition.student?.name}</span>
                  </div>
                </td>
                <td>{tuition.location}</td>
                <td>{tuition.budget} BDT</td>
                <td>
                  <span className={`badge ${tuition.status === 'approved' ? 'badge-success' :
                      tuition.status === 'rejected' ? 'badge-error' : 'badge-warning'
                    } badge-outline capitalize`}>
                    {tuition.status}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <Link to={`/tuitions/${tuition._id}`} className="btn btn-sm btn-ghost" title="View Details">
                      <FaEye />
                    </Link>
                    {tuition.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(tuition._id, 'approved')}
                          className="btn btn-sm btn-success text-white"
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleStatusChange(tuition._id, 'rejected')}
                          className="btn btn-sm btn-error text-white"
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tuitions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No tuitions found.
        </div>
      )}
    </div>
  );
};

export default TuitionManagement;
