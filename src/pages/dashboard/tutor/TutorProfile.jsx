import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useToast from '../../../hooks/useToast';
import { Save, User, Briefcase, BookOpen, DollarSign, MapPin } from 'lucide-react';
import ProfileSettings from '../../../components/dashboard/ProfileSettings';

const TutorProfile = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);

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
        }
    };

    if (loading) return <div className="flex justify-center p-10"><span className="loading loading-spinner text-primary"></span></div>;

    return (
        <div className="space-y-10">
            <div className="border-b border-gray-200 pb-5">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Profile Management</h1>
                <p className="text-gray-500">Manage your personal and professional information.</p>
            </div>

            {/* Basic Info (Reusing Shared Component) */}
            <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <User className="text-primary" /> Personal Information
                </h2>
                <ProfileSettings />
            </section>

            <div className="divider"></div>

            {/* Professional Info */}
            <section className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-200">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Briefcase className="text-secondary" /> Professional Details
                </h2>

                <form onSubmit={handleTutorProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control col-span-2">
                        <label className="label font-medium"><span className="label-text">Bio / Introduction</span></label>
                        <textarea
                            className="textarea textarea-bordered h-24"
                            placeholder="Write a short bio about yourself..."
                            value={tutorData.bio}
                            onChange={(e) => setTutorData({ ...tutorData, bio: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="form-control">
                        <label className="label font-medium flex items-center gap-2"><BookOpen size={16} /> Highest Qualification</label>
                        <input
                            type="text"
                            className="input input-bordered"
                            placeholder="e.g., B.Sc in Computer Science"
                            value={tutorData.qualification}
                            onChange={(e) => setTutorData({ ...tutorData, qualification: e.target.value })}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label font-medium flex items-center gap-2"><Briefcase size={16} /> Experience (Years)</label>
                        <input
                            type="text"
                            className="input input-bordered"
                            placeholder="e.g., 2 Years"
                            value={tutorData.experience}
                            onChange={(e) => setTutorData({ ...tutorData, experience: e.target.value })}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label font-medium flex items-center gap-2"><BookOpen size={16} /> Subjects (Comma Separated)</label>
                        <input
                            type="text"
                            className="input input-bordered"
                            placeholder="e.g., Math, Physics, English"
                            value={tutorData.subjects}
                            onChange={(e) => setTutorData({ ...tutorData, subjects: e.target.value })}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label font-medium flex items-center gap-2"><DollarSign size={16} /> Hourly Rate (BDT)</label>
                        <input
                            type="number"
                            className="input input-bordered"
                            placeholder="e.g., 500"
                            value={tutorData.hourlyRate}
                            onChange={(e) => setTutorData({ ...tutorData, hourlyRate: e.target.value })}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label font-medium flex items-center gap-2"><MapPin size={16} /> Preferred Location</label>
                        <input
                            type="text"
                            className="input input-bordered"
                            placeholder="e.g., Mirpur, Dhanmondi"
                            value={tutorData.location}
                            onChange={(e) => setTutorData({ ...tutorData, location: e.target.value })}
                        />
                    </div>

                    <div className="col-span-2 flex justify-end mt-4">
                        <button type="submit" className="btn btn-secondary px-8 gap-2">
                            <Save size={18} /> Save Professional Details
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default TutorProfile;
