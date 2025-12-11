import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaChalkboardTeacher, FaBookOpen } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

const TuitionDetails = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [tuition, setTuition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applicationData, setApplicationData] = useState({
    qualifications: '',
    experience: '',
    expectedSalary: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTuition = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/tuitions/${id}`);
        if (response.data.success) {
          setTuition(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching tuition details:', error);
        toast.error('Failed to load tuition details');
      } finally {
        setLoading(false);
      }
    };

    fetchTuition();
  }, [id]);

  const handleApplyChange = (e) => {
    setApplicationData({
      ...applicationData,
      [e.target.name]: e.target.value
    });
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/applications`,
        {
          tuitionId: id,
          ...applicationData
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success('Application submitted successfully!');
        setApplyModalOpen(false);
        navigate('/dashboard/tutor/my-applications');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container section-padding text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!tuition) {
    return (
      <div className="page-container section-padding text-center">
        <h2 className="text-2xl font-bold text-error">Tuition not found</h2>
      </div>
    );
  }

  return (
    <div className="page-container section-padding">
      <div className="max-w-4xl mx-auto bg-base-100 shadow-xl rounded-xl overflow-hidden border border-base-200">
        <div className="bg-primary/10 p-8 border-b border-base-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-secondary mb-2">{tuition.subject}</h1>
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-primary badge-outline text-lg p-3">{tuition.class}</span>
                <span className={`badge ${tuition.status === 'approved' ? 'badge-success' : 'badge-warning'
                  } badge-outline text-lg p-3 capitalize`}>
                  {tuition.status}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Posted by</p>
              <p className="font-semibold text-lg">{tuition.student?.name}</p>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-primary text-xl mt-1" />
              <div>
                <h3 className="font-semibold text-gray-500">Location</h3>
                <p className="text-lg">{tuition.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaMoneyBillWave className="text-primary text-xl mt-1" />
              <div>
                <h3 className="font-semibold text-gray-500">Budget</h3>
                <p className="text-lg">{tuition.budget} BDT/month</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FaClock className="text-primary text-xl mt-1" />
              <div>
                <h3 className="font-semibold text-gray-500">Schedule</h3>
                <p className="text-lg">{tuition.schedule}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <FaBookOpen className="text-primary" /> Description
            </h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {tuition.description}
            </p>
          </div>
        </div>

        <div className="p-8 bg-base-200/30 border-t border-base-200 flex justify-center">
          {user && user.role === 'tutor' ? (
            <button
              onClick={() => setApplyModalOpen(true)}
              className="btn btn-primary btn-lg px-12"
            >
              <FaChalkboardTeacher className="mr-2" /> Apply Now
            </button>
          ) : user && user.role === 'student' ? (
            <p className="text-gray-500 italic">You are viewing this as a student.</p>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="btn btn-outline btn-primary"
            >
              Login as Tutor to Apply
            </button>
          )}
        </div>
      </div>

      {/* Application Modal */}
      {applyModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-2xl mb-6 text-center text-primary">Apply for Tuition</h3>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label font-semibold">Name</label>
                  <input type="text" value={user.displayName || user.name || ''} className="input input-bordered bg-base-200" readOnly />
                </div>
                <div className="form-control">
                  <label className="label font-semibold">Email</label>
                  <input type="email" value={user.email} className="input input-bordered bg-base-200" readOnly />
                </div>
              </div>

              <div className="form-control">
                <label className="label font-semibold">Qualifications</label>
                <textarea
                  name="qualifications"
                  placeholder="e.g. B.Sc in Mathematics from DU"
                  className="textarea textarea-bordered h-24"
                  value={applicationData.qualifications}
                  onChange={handleApplyChange}
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label font-semibold">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    placeholder="e.g. 2 years"
                    className="input input-bordered"
                    value={applicationData.experience}
                    onChange={handleApplyChange}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label font-semibold">Expected Salary</label>
                  <input
                    type="number"
                    name="expectedSalary"
                    placeholder="e.g. 5000"
                    className="input input-bordered"
                    value={applicationData.expectedSalary}
                    onChange={handleApplyChange}
                    required
                  />
                </div>
              </div>

              <div className="modal-action mt-8">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setApplyModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-8"
                  disabled={submitting}
                >
                  {submitting ? <span className="loading loading-spinner"></span> : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TuitionDetails;
