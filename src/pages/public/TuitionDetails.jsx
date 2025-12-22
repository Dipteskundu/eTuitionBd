import React, { useEffect, useState } from 'react';
import useTitle from '../../hooks/useTitle';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import BecomeTeacherModal from '../../components/BecomeTeacherModal';
import ApplicationModal from '../../components/ApplicationModal';
import { MapPin, DollarSign, Calendar, BookOpen, CheckCircle, ArrowLeft, Clock, GraduationCap } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';

const TuitionDetails = () => {
    useTitle('Tuition Details');
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, role } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [tuition, setTuition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [showBecomeTeacherModal, setShowBecomeTeacherModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        const fetchTuition = async () => {
            try {
                const res = await axiosInstance.get(`/tuitions/${id}`);
                if (res.data) {
                    setTuition(res.data);
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

    if (loading) return <Spinner fullScreen variant="dots" />;
    if (!tuition) return null;

    const isAssigned = !!tuition.assignedTutorId || !!tuition.assignedTutorEmail;

    return (
        <div className="min-h-screen bg-base-100 py-12 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] animate-float" />
                <div className="absolute -bottom-[10%] -left-[10%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[100px] animate-float animation-delay-200" />
            </div>

            <div className="container mx-auto px-4 relative z-10 max-w-5xl">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    leftIcon={<ArrowLeft size={18} />}
                    className="mb-6 hover:bg-base-200"
                >
                    Back to Tuitions
                </Button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card glass className="overflow-hidden border-0 !p-0">
                        {/* Header Banner */}
                        <div className="bg-primary p-8 md:p-12 text-white relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-black/10 backdrop-blur-sm z-0"></div>
                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                    <div>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className="badge badge-lg bg-white/20 border-0 text-white backdrop-blur-md">
                                                Class: {tuition.class}
                                            </span>
                                            <span className="badge badge-lg bg-white/20 border-0 text-white backdrop-blur-md">
                                                {tuition.medium || 'General Medium'}
                                            </span>
                                        </div>
                                        <h1 className="text-3xl md:text-5xl font-heading font-bold mb-2">{tuition.subject}</h1>
                                    </div>

                                    {isAssigned && (
                                        <div className="bg-white/90 text-success px-4 py-2 rounded-xl font-bold shadow-lg flex items-center gap-2 animate-pulse">
                                            <CheckCircle size={20} />
                                            Assigned
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-base-100/50 border border-base-200 hover:border-primary/30 transition-colors">
                                        <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-base-content/50 uppercase tracking-wider mb-1">Location</h3>
                                            <p className="text-xl font-semibold text-base-content">{tuition.location}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-base-100/50 border border-base-200 hover:border-success/30 transition-colors">
                                        <div className="p-3 bg-success/10 rounded-xl text-success shrink-0">
                                            <DollarSign size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-base-content/50 uppercase tracking-wider mb-1">Salary</h3>
                                            <p className="text-xl font-semibold text-base-content">{tuition.salary} BDT/Month</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-base-100/50 border border-base-200 hover:border-secondary/30 transition-colors">
                                        <div className="p-3 bg-secondary/10 rounded-xl text-secondary shrink-0">
                                            <Calendar size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-base-content/50 uppercase tracking-wider mb-1">Schedule</h3>
                                            <p className="text-xl font-semibold text-base-content">{tuition.daysPerWeek} Days/Week</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col h-full">
                                <div className="bg-base-200/30 p-8 rounded-2xl border border-base-200 flex-grow">
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                                        <BookOpen size={24} />
                                        Description & Requirements
                                    </h3>
                                    <p className="text-base-content/80 text-lg leading-relaxed">
                                        {tuition.description || "No specific requirements provided for this tuition. Please contact for more details."}
                                    </p>
                                </div>

                                <div className="mt-8 grid grid-cols-2 gap-4">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        onClick={() => navigate(-1)}
                                        className="border-base-content/20 hover:border-base-content/40 hover:bg-base-content/5"
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        size="lg"
                                        onClick={handleApplyClick}
                                        disabled={isAssigned || role === 'admin'}
                                        variant={isAssigned || role === 'admin' ? "ghost" : "gradient"}
                                        className={isAssigned || role === 'admin' ? "bg-base-300 text-base-content/50 cursor-not-allowed" : "shadow-lg hover:shadow-primary/30"}
                                    >
                                        {isAssigned
                                            ? "Tutor Assigned"
                                            : role === 'admin'
                                                ? "Admins Restricted"
                                                : "Apply Now"
                                        }
                                    </Button>
                                </div>
                                {role === 'student' && !isAssigned && (
                                    <p className="text-xs text-center text-base-content/50 mt-3 flex items-center justify-center gap-1">
                                        <GraduationCap size={14} /> Applying requires switching to a Tutor account
                                    </p>
                                )}
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>

            <BecomeTeacherModal
                isOpen={showBecomeTeacherModal}
                onClose={() => setShowBecomeTeacherModal(false)}
            />

            <ApplicationModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                tuition={tuition}
                onSuccess={() => setApplying(false)}
            />
        </div>
    );
};

export default TuitionDetails;
