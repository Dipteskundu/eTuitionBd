import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';

const OngoingTuitions = () => {
  const { token } = useAuth();
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOngoingTuitions = async () => {
      try {
        // Fetch applications where status is 'approved'
        // Note: We reuse the my-applications endpoint and filter on client side
        // Ideally, backend should support filtering or a dedicated endpoint
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/applications/tutor/my-applications`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        if (response.data.success) {
          const approvedApps = response.data.data.filter(app => app.status === 'approved');
          setTuitions(approvedApps);
        }
      } catch (error) {
        console.error('Error fetching ongoing tuitions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOngoingTuitions();
  }, [token]);

  if (loading) {
    return (
      <div className="page-container section-padding text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="page-container section-padding">
      <h1 className="text-3xl font-bold mb-8 text-primary">Ongoing Tuitions</h1>

      {tuitions.length === 0 ? (
        <div className="text-center py-12 bg-base-200 rounded-xl">
          <p className="text-xl text-gray-500">You don't have any ongoing tuitions yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tuitions.map((app) => (
            <div key={app._id} className="card bg-base-100 shadow-xl border border-success/30">
              <div className="card-body">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="card-title text-2xl text-primary">{app.tuition?.subject}</h2>
                    <p className="text-gray-600 font-semibold">{app.tuition?.class}</p>
                  </div>
                  <div className="badge badge-success text-white p-3">Active</div>
                </div>

                <div className="space-y-3 bg-base-200/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-8">
                        <span className="text-xs">{app.tuition?.student?.name?.charAt(0)}</span>
                      </div>
                    </div>
                    <span className="font-semibold">{app.tuition?.student?.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaEnvelope className="text-primary" />
                    <span>{app.tuition?.student?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <FaMapMarkerAlt className="text-primary" />
                    <span>{app.tuition?.location}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-base-200 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Agreed Salary</p>
                    <p className="font-bold text-lg">{app.expectedSalary} BDT</p>
                  </div>
                  <Link to={`/tuitions/${app.tuition?._id}`} className="btn btn-outline btn-sm">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OngoingTuitions;
