import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Calendar, DollarSign, Briefcase } from 'lucide-react';

const AppliedTuitions = () => {
    const axiosSecure = useAxiosSecure();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await axiosSecure.get('/my-applications');
                setApplications(res.data);
            } catch (error) {
                console.error("Failed to fetch applications", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [axiosSecure]);

    if (loading) return <div className="flex justify-center p-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Applications</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {applications.length === 0 ? (
                    <div className="col-span-full text-center py-10 bg-base-100 rounded-xl border border-base-200">
                        <p className="text-gray-500">You haven't applied to any tuitions yet.</p>
                        <a href="/dashboard/tutor/available-tuitions" className="btn btn-link">Browse Available Tuitions</a>
                    </div>
                ) : (
                    applications.map((app) => (
                        <div key={app._id} className="card bg-base-100 shadow-sm border border-base-200">
                            <div className="card-body">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="card-title text-base">Application ID: {app._id.substring(0, 8)}...</h2>
                                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                            <Calendar size={12} /> {new Date(app.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <span className={`badge ${app.status === 'approved' ? 'badge-success text-white' :
                                            app.status === 'rejected' ? 'badge-error text-white' :
                                                'badge-warning text-white'
                                        }`}>
                                        {app.status}
                                    </span>
                                </div>
                                <div className="divider my-2"></div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Expected Salary:</span>
                                        <span className="font-semibold">BDT {app.expectedSalary}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-gray-500">Experience Mentioned:</span>
                                        <p className="text-gray-700 bg-base-200 p-2 rounded text-xs">{app.experience}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AppliedTuitions;
