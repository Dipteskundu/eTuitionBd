import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import BecomeTeacherModal from '../../components/BecomeTeacherModal';
import ApplicationModal from '../../components/ApplicationModal';
import { MapPin, DollarSign, Calendar, BookOpen, Clock, User, CheckCircle } from 'lucide-react';
import Loader from '../../components/ui/Loader';

const TuitionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, role } = useAuth(); // Role is loaded from AuthContext
    const axiosSecure = useAxiosSecure();

    const [tuition, setTuition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);

    // Modal States
    const [showBecomeTeacherModal, setShowBecomeTeacherModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        const fetchTuition = async () => {
            try {
                // Fetch specific tuition via public API (or specific ID endpoint)
                // Assuming backend has GET /tuitions/:id or we filter from list?
                // The backend generic /tuitions returns all. We might need a specific endpoint or find it.
                // Wait, index.js doesn't show a specific public GET /tuitions/:id. 
                // It shows GET /tuitions returning all.
                // I'll assume I need to fetch all and find, OR add the endpoint.
                // Actually, standard practice suggests GET /tuitions/:id should exist or I should add it.
                // Reviewing index.js: Line 259 is GET /tuitions. No specific ID route visible in public section.
                // Student has GET /applied-tutors/:tuitionId.
                // I will add GET /tuitions/:id to backend to be safe/clean in next step if needed, or just fetch all and filter for now (inefficient but safe).
                // Let's try fetching all and filtering first to avoid backend restart lag issues if possible, 
                // BUT fetching all is bad.
                // I'll check if I can add the endpoint quickly or if I missed it.
                // Missed checking: I did not see app.get('/tuitions/:id') in the file view.
                // PROPOSAL: Use axiosInstance.get(`/tuitions`) and find.

                const res = await axiosInstance.get('/tuitions');
                // res.data.data is the array
                const found = res.data.data.find(t => t._id === id);
                if (found) {
                    setTuition(found);
                } else {
                    toast.error("Tuition not found");
                    navigate('/tuitions');
                }
            } catch (error) {
                console.error("Error fetching tuition:", error);
                toast.error("Failed to load details");
            } finally {
                setLoading(false);
            }
        };
        fetchTuition();
    }, [id, navigate]);

    const handleApplyClick = () => {
        if (!user) {
            // Redirect to login with state to return
            navigate('/login', { state: { from: location } });
            return;
        }

        if (role === 'student') {
            setShowBecomeTeacherModal(true);
            return;
        }

        if (role === 'tutor') {
            setShowConfirmModal(true);
            return;
        }

        if (role === 'admin') {
            toast.error("Admins cannot apply for tuitions.");
            return;
        }
    };

    const confirmApply = async () => {
        setApplying(true);
        try {
            await axiosSecure.post('/apply-tuition', {
                tuitionId: id,
                expectedSalary: tuition.salary, // defaulting to posted salary
                // We could prompt for salary negotiation but requirement says just "Apply"
            });
            toast.success("Application sent successfully!");
            setShowConfirmModal(false);
        } catch (error) {
            console.error(error);
            if (error.response?.status === 409) {
                toast.error(error.response.data.message || "Already applied!");
            } else {
                toast.error(error.response?.data?.message || "Failed to apply.");
            }
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <Loader fullScreen />;
    if (!tuition) return <div className="text-center py-20">Tuition not found.</div>;

    const isAssigned = !!tuition.assignedTutorId || !!tuition.assignedTutorEmail;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{tuition.subject}</h1>
                            <p className="opacity-90 flex items-center gap-2">
                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                                    Class: {tuition.class}
                                </span>
                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                                    {tuition.medium || 'General Medium'}
                                </span>
                            </p>
                        </div>
                        {isAssigned && (
                            <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2">
                                <CheckCircle size={20} />
                                Assigned
                            </div>
                        )}
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl text-purple-600 dark:text-purple-300">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</h3>
                                <p className="text-lg font-medium text-gray-900 dark:text-white">{tuition.location}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl text-green-600 dark:text-green-300">
                                <DollarSign size={24} />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Salary</h3>
                                <p className="text-lg font-medium text-gray-900 dark:text-white">{tuition.salary} BDT/Month</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl text-blue-600 dark:text-blue-300">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Schedule</h3>
                                <p className="text-lg font-medium text-gray-900 dark:text-white">{tuition.daysPerWeek} Days/Week</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                                <BookOpen size={20} className="text-purple-500" />
                                Description
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {tuition.description || "No additional details provided by the guardian."}
                            </p>
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={handleApplyClick}
                                disabled={isAssigned || role === 'admin'}
                                className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] ${isAssigned
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                                    : role === 'admin'
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700'
                                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-purple-500/30'
                                    }`}
                            >
                                {isAssigned
                                    ? "Tutor Already Assigned"
                                    : role === 'admin'
                                        ? "Admins Cannot Apply"
                                        : role === 'student'
                                            ? "Apply Now" // Will trigger Become Teacher Modal
                                            : "Apply Now"
                                }
                            </button>
                            {role === 'student' && !isAssigned && (
                                <p className="text-xs text-center text-gray-500 mt-2">
                                    *Applying requires a Tutor account
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Become Teacher Modal */}
            <BecomeTeacherModal
                isOpen={showBecomeTeacherModal}
                onClose={() => setShowBecomeTeacherModal(false)}
            />

            {/* Application Modal for Tutors */}
            <ApplicationModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                tuition={tuition}
                onSuccess={() => {
                    // Optional: Refetch or update UI state to show Applied
                    setApplying(false);
                }}
            />
        </div>
    );
};

export default TuitionDetails;
