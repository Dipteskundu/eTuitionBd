import React, { useEffect, useState } from 'react';
import useTitle from '../../hooks/useTitle';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { MapPin, Star, BadgeCheck, Book, User, Mail, Phone, ArrowLeft, GraduationCap, Award } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import ReviewForm from '../../components/reviews/ReviewForm';
import ReviewsList from '../../components/reviews/ReviewsList';
import BookmarkButton from '../../components/ui/BookmarkButton';
import { MessageCircle } from 'lucide-react';

const TutorDetails = () => {
    useTitle('Tutor Details');
    const { id } = useParams();
    const navigate = useNavigate();
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { role } = useRole();
    const axiosSecure = useAxiosSecure();
    const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });

    useEffect(() => {
        if (tutor) {
            fetchStats();
        }
    }, [tutor]);

    const fetchStats = async () => {
        try {
            const res = await axiosInstance.get(`/tutor-rating/${tutor.email}`);
            setStats(res.data);
        } catch (error) {
            console.error('Failed to fetch rating stats:', error);
        }
    };

    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [sending, setSending] = useState(false);

    const handleContactClick = () => {
        if (!user) {
            toast.error('Please login to contact tutor');
            navigate('/login');
            return;
        }
        setIsContactModalOpen(true);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText.trim()) return;

        setSending(true);
        try {
            // 1. Get or Create Conversation
            const convRes = await axiosSecure.post('/conversations', {
                recipientEmail: tutor.email
            });
            const conversationId = convRes.data._id;

            // 2. Send Message
            await axiosSecure.post('/messages', {
                conversationId,
                content: messageText,
                receiverEmail: tutor.email
            });

            toast.success('Message sent successfully!');
            setMessageText('');
            setIsContactModalOpen(false);
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        const fetchTutor = async () => {
            try {
                // Fetching all tutors to find the specific one as per current API pattern
                const res = await axiosInstance.get(`/tutors/${id}`);
                if (res.data) {
                    setTutor(res.data);
                } else {
                    toast.error("Tutor not found");
                    navigate('/tutors');
                }
            } catch (error) {
                console.error("Failed to fetch tutor details", error);
                toast.error("Failed to load tutor details");
                navigate('/tutors');
            } finally {
                setLoading(false);
            }
        };

        fetchTutor();
    }, [id, navigate]);

    if (loading) return <Spinner fullScreen variant="dots" />;
    if (!tutor) return null;

    return (
        <div className="min-h-screen bg-base-100 py-12 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px] animate-float" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px] animate-float animation-delay-200" />
            </div>

            <div className="container mx-auto px-4 relative z-10 max-w-5xl">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    leftIcon={<ArrowLeft size={18} />}
                    className="mb-6 hover:bg-base-200"
                >
                    Back to Tutors
                </Button>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Card glass className="overflow-hidden border-0 !p-0">
                        {/* Profile Header */}
                        <div className="bg-base-200 border-b border-base-200 p-8 md:p-12 relative">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                                <div className="relative">
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full ring-4 ring-primary/20 p-1 bg-base-100">
                                        <div className="w-full h-full rounded-full overflow-hidden">
                                            {tutor.photoURL ? (
                                                <img src={tutor.photoURL} alt={tutor.displayName} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-base-300 text-base-content/40">
                                                    <User size={64} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {tutor.verified && (
                                        <div className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-lg" title="Verified Tutor">
                                            <BadgeCheck className="w-6 h-6 text-blue-500 fill-blue-500/10" />
                                        </div>
                                    )}
                                </div>

                                <div className="text-center md:text-left flex-1">
                                    <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 text-base-content">{tutor.displayName}</h1>
                                    <p className="text-xl text-primary font-medium mb-4 flex items-center justify-center md:justify-start gap-2">
                                        <MapPin size={20} /> {tutor.location}
                                    </p>

                                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                                        {tutor.expertise && tutor.expertise.map((exp, idx) => (
                                            <span key={idx} className="badge badge-lg badge-primary badge-outline bg-primary/5 px-4 py-3">
                                                {exp}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                        <div className="flex items-center gap-2 text-base-content/70">
                                            <Mail size={16} /> {tutor.email}
                                        </div>
                                        {tutor.phone && (
                                            <div className="flex items-center gap-2 text-base-content/70">
                                                <Phone size={16} /> {tutor.phone}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Body */}
                        <div className="p-8 md:p-12">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 space-y-8">
                                    <section>
                                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 border-b border-base-200 pb-2">
                                            <User className="text-primary" /> About Me
                                        </h2>
                                        <p className="text-base-content/80 text-lg leading-relaxed">
                                            {tutor.bio || "No bio available."}
                                        </p>
                                    </section>

                                    <section>
                                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 border-b border-base-200 pb-2">
                                            <GraduationCap className="text-secondary" /> Education & Background
                                        </h2>
                                        <div className="bg-base-200/50 p-6 rounded-xl border border-base-200">
                                            <p className="text-base-content/70 italic">
                                                Detailed background information not currently available.
                                            </p>
                                        </div>
                                    </section>

                                    <section>
                                        <div className="flex justify-between items-center mb-6 border-b border-base-200 pb-2">
                                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                                <Star className="text-warning" /> Reviews
                                            </h2>
                                            {role === 'student' && (
                                                <div className="tooltip" data-tip="Only students with completed tuitions can review">
                                                    <span className="text-xs text-base-content/50 border border-base-300 px-2 py-1 rounded-full">
                                                        Verified Students Only
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {role === 'student' && (
                                            <div className="mb-8">
                                                <ReviewForm
                                                    tutorEmail={tutor.email}
                                                    onSuccess={() => {
                                                        fetchStats();
                                                        window.location.reload();
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <ReviewsList tutorEmail={tutor.email} />
                                    </section>
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-6">
                                    <div className="bg-primary/5 p-6 rounded-2xl border border-primary-500/10 relative">
                                        <div className="absolute top-4 right-4">
                                            <BookmarkButton itemId={tutor._id} type="tutor" />
                                        </div>
                                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                            <Award className="text-warning" /> Tutor Stats
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                                                <span className="text-base-content/70">Experience</span>
                                                <span className="font-bold">2+ Years</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                                                <span className="text-base-content/70">Rating</span>
                                                <span className="font-bold flex items-center gap-1 text-warning">
                                                    {stats.averageRating || 'N/A'} <Star size={14} fill="currentColor" />
                                                    <span className="text-xs text-base-content/50 ml-1">({stats.totalReviews})</span>
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                                                <span className="text-base-content/70">Tuitions</span>
                                                <span className="font-bold">12 Active</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        fullWidth
                                        size="lg"
                                        variant="primary"
                                        className="shadow-lg shadow-primary/20"
                                        onClick={handleContactClick}
                                        leftIcon={MessageCircle}
                                    >
                                        Contact Tutor
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Contact Modal */}
            {isContactModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto custom-scrollbar">
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                        className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-lg mx-auto border border-base-200 my-auto"
                    >
                        {/* Modal Header */}
                        <div className="bg-base-100 p-6 sm:p-8 border-b border-base-200 text-center sm:text-left sticky top-0 z-10 backdrop-blur-md">
                            <h3 className="text-2xl font-bold text-base-content font-heading tracking-tight">Contact Tutor</h3>
                            <p className="text-sm text-base-content/60 mt-1">Get in touch with <span className="text-primary font-semibold">{tutor.displayName}</span></p>
                        </div>

                        <div className="p-6 sm:p-8 space-y-8">
                            {/* Contact Info Cards */}
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center gap-4 bg-base-200/40 p-4 rounded-2xl group border border-transparent transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
                                        <User size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] text-base-content/40 uppercase font-black tracking-widest">Full Name</p>
                                        <p className="font-bold text-base-content leading-tight">{tutor.displayName}</p>
                                    </div>
                                </div>

                                <a
                                    href={`mailto:${tutor.email}`}
                                    className="flex items-center gap-4 bg-blue-500/5 p-4 rounded-2xl hover:bg-blue-500/10 transition-all group border border-blue-500/10 hover:border-blue-500/20"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform shadow-sm">
                                        <Mail size={20} />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-[10px] text-blue-500/60 uppercase font-black tracking-widest">Email Address</p>
                                        <p className="font-bold text-base-content truncate group-hover:text-blue-600 transition-colors leading-tight">{tutor.email}</p>
                                    </div>
                                </a>

                                {tutor.phone && (
                                    <a
                                        href={`tel:${tutor.phone}`}
                                        className="flex items-center gap-4 bg-green-500/5 p-4 rounded-2xl hover:bg-green-500/10 transition-all group border border-green-500/10 hover:border-green-500/20"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform shadow-sm">
                                            <Phone size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-green-500/60 uppercase font-black tracking-widest">Phone Number</p>
                                            <p className="font-bold text-base-content group-hover:text-green-600 transition-colors leading-tight">{tutor.phone}</p>
                                        </div>
                                    </a>
                                )}
                            </div>

                            {/* Message Form */}
                            <form onSubmit={handleSendMessage} className="space-y-6">
                                <div className="form-control">
                                    <label className="label pt-0 pb-3">
                                        <span className="label-text font-bold text-base-content/80 flex items-center gap-2">
                                            <MessageCircle size={16} className="text-primary" /> Send a Message
                                        </span>
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered min-h-[140px] focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none text-base leading-relaxed bg-base-100 border-base-300 shadow-inner"
                                        placeholder={`Hi ${tutor?.displayName?.split(' ')?.[0] || 'Tutor'}, I'm interested in your tutoring services...`}
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="order-2 sm:order-1 flex-1 py-4 text-base font-bold rounded-2xl hover:bg-base-200"
                                        onClick={() => setIsContactModalOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="order-1 sm:order-2 flex-[1.5] py-4 text-base font-bold rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all"
                                        disabled={sending}
                                    >
                                        {sending ? (
                                            <span className="flex items-center gap-2">
                                                <Spinner size="sm" /> Sending...
                                            </span>
                                        ) : 'Send Message'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default TutorDetails;
