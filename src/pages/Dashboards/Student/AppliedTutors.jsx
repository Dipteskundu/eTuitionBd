import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaCheck, FaTimes, FaUserGraduate } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';

const AppliedTutors = () => {
  const { token } = useAuth();
  const [tuitions, setTuitions] = useState([]);
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch student's tuitions first
  useEffect(() => {
    const fetchTuitionsAndApplications = async () => {
      try {
        // 1. Get all tuitions posted by student
        const tuitionsRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/tuitions/student/my-tuitions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (tuitionsRes.data.success) {
          const myTuitions = tuitionsRes.data.data;
          setTuitions(myTuitions);

          // 2. For each tuition, fetch applications
          const appsData = {};
          await Promise.all(myTuitions.map(async (tuition) => {
            try {
              const appsRes = await axios.get(
                `${import.meta.env.VITE_API_URL}/applications/tuition/${tuition._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (appsRes.data.success) {
                appsData[tuition._id] = appsRes.data.data;
              }
            } catch (err) {
              console.error(`Error fetching apps for tuition ${tuition._id}`, err);
            }
          }));
          setApplications(appsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchTuitionsAndApplications();
  }, [token]);

  const handleReject = async (appId, tuitionId) => {
    if (!window.confirm('Are you sure you want to reject this tutor?')) return;

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/applications/${appId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Application rejected');

      // Update local state
      setApplications(prev => ({
        ...prev,
        [tuitionId]: prev[tuitionId].map(app =>
          app._id === appId ? { ...app, status: 'rejected' } : app
        )
      }));
    } catch (error) {
      toast.error('Failed to reject application');
    }
  };

  const handleApprove = async (appId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/payments/create-checkout-session`,
        { applicationId: appId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment');
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
      <h1 className="text-3xl font-bold mb-8 text-primary">Applied Tutors</h1>

      {tuitions.length === 0 ? (
        <div className="text-center py-12 bg-base-200 rounded-xl">
          <p className="text-xl text-gray-500">You haven't posted any tuitions yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {tuitions.map(tuition => {
            const tuitionApps = applications[tuition._id] || [];
            if (tuitionApps.length === 0) return null;

            return (
              <div key={tuition._id} className="card bg-base-100 shadow-lg border border-base-200">
                <div className="card-header p-6 border-b bg-base-200/30">
                  <h2 className="text-xl font-bold text-secondary">
                    {tuition.subject} <span className="text-sm font-normal text-gray-500">({tuition.class})</span>
                  </h2>
                  <p className="text-sm text-gray-500">Budget: {tuition.budget} BDT</p>
                </div>
                <div className="card-body p-0">
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>Tutor</th>
                          <th>Qualifications</th>
                          <th>Exp. Salary</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tuitionApps.map(app => (
                          <tr key={app._id}>
                            <td>
                              <div className="flex items-center gap-3">
                                <div className="avatar">
                                  <div className="mask mask-squircle w-12 h-12">
                                    <img src={app.tutor.photoURL || "https://via.placeholder.com/150"} alt={app.tutor.name} />
                                  </div>
                                </div>
                                <div>
                                  <div className="font-bold">{app.tutor.name}</div>
                                  <div className="text-sm opacity-50">{app.tutor.email}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="text-sm">{app.qualifications}</div>
                              <div className="text-xs text-gray-500">{app.experience}</div>
                            </td>
                            <td>{app.expectedSalary} BDT</td>
                            <td>
                              <div className={`badge ${app.status === 'approved' ? 'badge-success' :
                                  app.status === 'rejected' ? 'badge-error' : 'badge-warning'
                                } badge-outline capitalize`}>
                                {app.status}
                              </div>
                            </td>
                            <td>
                              {app.status === 'pending' && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleApprove(app._id)}
                                    className="btn btn-xs btn-success text-white"
                                    title="Accept & Pay"
                                  >
                                    <FaCheck /> Accept
                                  </button>
                                  <button
                                    onClick={() => handleReject(app._id, tuition._id)}
                                    className="btn btn-xs btn-error text-white"
                                    title="Reject"
                                  >
                                    <FaTimes /> Reject
                                  </button>
                                </div>
                              )}
                              {app.status === 'approved' && (
                                <span className="text-success font-semibold text-sm">Hired</span>
                              )}
                              {app.status === 'rejected' && (
                                <span className="text-error font-semibold text-sm">Rejected</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
          {Object.values(applications).every(apps => apps.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              No applications received yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AppliedTutors;
