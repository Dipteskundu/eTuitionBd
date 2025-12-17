import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useToast from '../../../hooks/useToast';
import { Save, User, Briefcase, BookOpen, DollarSign, MapPin, FileText } from 'lucide-react';
import ProfileSettings from '../../../components/dashboard/ProfileSettings';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import { motion } from 'framer-motion';

const TutorProfile = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [tutorData, setTutorData] = useState({
        qualification: '',
        experience: '',
        subjects: '', // Keeping as string for comma separated input for simplicity
        hourlyRate: '',
        location: '',
        bio: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axiosSecure.get('/user/profile');
                const data = res.data;
                setTutorData({
                    qualification: data.qualification || '',
                    experience: data.experience || '',
                    subjects: Array.isArray(data.subjects) ? data.subjects.join(', ') : (data.subjects || ''),
                    hourlyRate: data.hourlyRate || '',
                    location: data.location || '',
                    bio: data.bio || ''
                });
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [axiosSecure]);

    const handleTutorProfileUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                ...tutorData,
                subjects: tutorData.subjects.split(',').map(s => s.trim()).filter(s => s) // Convert back to array
            };

            const res = await axiosSecure.put('/tutor/profile', payload);
            if (res.data.modifiedCount > 0 || res.data.matchedCount > 0) {
                showToast('Professional profile updated successfully!', 'success');
            }
        } catch (error) {
            console.error(error);
            showToast('Failed to update professional profile.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <Spinner variant="dots" fullScreen />;

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-heading font-bold gradient-text">Profile Management</h1>
                <p className="text-base-content/70 mt-1">Manage your personal and professional information to attract students.</p>
            </motion.div>

            {/* Basic Info (Reusing Shared Component) */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <User className="text-primary" /> Personal Information
                </h2>
                <ProfileSettings />
            </motion.section>

            {/* Professional Info */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Briefcase className="text-secondary" /> Professional Details
                </h2>

                <Card glass className="p-8 border-t-4 border-t-secondary/50">
                    <form onSubmit={handleTutorProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2">
                            <label className="label font-medium pl-0"><span className="label-text flex items-center gap-2 text-base"><FileText size={16} /> Bio / Introduction</span></label>
                            <textarea
                                className="textarea textarea-bordered h-32 w-full focus:outline-none focus:ring-2 focus:ring-secondary/20 rounded-xl bg-base-100/50"
                                placeholder="Write a compelling bio about yourself..."
                                value={tutorData.bio}
                                onChange={(e) => setTutorData({ ...tutorData, bio: e.target.value })}
                            ></textarea>
                            <label className="label"><span className="label-text-alt text-base-content/50">Tell students about your teaching style and experience.</span></label>
                        </div>

                        <Input
                            label="Highest Qualification"
                            leftIcon={BookOpen}
                            placeholder="e.g., B.Sc in Computer Science"
                            value={tutorData.qualification}
                            onChange={(e) => setTutorData({ ...tutorData, qualification: e.target.value })}
                        />

                        <Input
                            label="Experience (Years)"
                            leftIcon={Briefcase}
                            placeholder="e.g., 2 Years"
                            value={tutorData.experience}
                            onChange={(e) => setTutorData({ ...tutorData, experience: e.target.value })}
                        />

                        <Input
                            label="Subjects (Comma Separated)"
                            leftIcon={BookOpen}
                            placeholder="e.g., Math, Physics, English"
                            value={tutorData.subjects}
                            onChange={(e) => setTutorData({ ...tutorData, subjects: e.target.value })}
                        />

                        <Input
                            label="Hourly Rate (BDT)"
                            type="number"
                            leftIcon={DollarSign}
                            placeholder="e.g., 500"
                            value={tutorData.hourlyRate}
                            onChange={(e) => setTutorData({ ...tutorData, hourlyRate: e.target.value })}
                        />

                        <div className="col-span-1 md:col-span-2">
                            <Input
                                label="Preferred Location"
                                leftIcon={MapPin}
                                placeholder="e.g., Mirpur, Dhanmondi"
                                value={tutorData.location}
                                onChange={(e) => setTutorData({ ...tutorData, location: e.target.value })}
                                fullWidth
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
                            <Button
                                type="submit"
                                variant="secondary"
                                size="lg"
                                className="px-8 shadow-lg shadow-secondary/20"
                                leftIcon={Save}
                                isLoading={isSubmitting}
                            >
                                Save Professional Details
                            </Button>
                        </div>
                    </form>
                </Card>
            </motion.section>
        </div>
    );
};

export default TutorProfile;
