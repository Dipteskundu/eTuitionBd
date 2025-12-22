import React, { useEffect, useState } from 'react';
import useTitle from '../../../hooks/useTitle';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useToast from '../../../hooks/useToast';
import { Search, MapPin, BookOpen, DollarSign, Send, Briefcase, GraduationCap } from 'lucide-react';
import Swal from 'sweetalert2';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import Spinner from '../../../components/ui/Spinner';
import { motion, AnimatePresence } from 'framer-motion';

const AvailableTuitions = () => {
    useTitle('Available Tuitions');
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const toast = useToast();
    const [tuitions, setTuitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        subject: '',
        location: '',
        class: ''
    });

    // Application Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTuition, setSelectedTuition] = useState(null);
    const [applicationData, setApplicationData] = useState({
        experience: '',
        qualification: '',
        expectedSalary: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchTuitions = async () => {
        setLoading(true);
        try {
            // Build query string
            let query = `?status=approved`; // Show Admin-approved tuitions
            if (filters.subject) query += `&subject=${filters.subject}`;
            if (filters.location) query += `&location=${filters.location}`;
            if (filters.class) query += `&class=${filters.class}`;

            const res = await axiosSecure.get(`/tuitions-post${query}`);
            setTuitions(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch tuitions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchTuitions();
        }, 500); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [filters.subject, filters.location, filters.class, axiosSecure]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleApplyClick = (tuition) => {
        setSelectedTuition(tuition);
        // Reset form or pre-fill from user profile if available
        setApplicationData({
            experience: '',
            qualification: '',
            expectedSalary: tuition.salary || ''
        });
        setIsModalOpen(true);
    };

    const handleApplicationSubmit = async (e) => {
        e.preventDefault();

        // 1. Confirm before submitting
        const result = await Swal.fire({
            title: 'Send Application?',
            text: `Apply for ${selectedTuition.subject} tuition?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, apply!',
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-ghost'
            }
        });

        if (!result.isConfirmed) return;

        setIsSubmitting(true);
        try {
            const payload = {
                tuitionId: selectedTuition._id,
                ...applicationData
            };
            const res = await axiosSecure.post('/apply-tuition', payload);
            if (res.data.insertedId) {
                Swal.fire({
                    title: 'Application Sent!',
                    text: 'The student will review your profile shortly.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { popup: 'rounded-2xl' }
                });
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error(error);
            if (error.response?.status === 409) {
                toast.warning('You have already applied to this tuition.');
            } else {
                toast.error('Failed to submit application.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-end gap-4"
            >
                <div>
                    <h1 className="text-3xl font-heading font-bold gradient-text">Available Tuitions</h1>
                    <p className="text-base-content/70 mt-1">Browse and apply for the latest tuition opportunities.</p>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card glass className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            leftIcon={BookOpen}
                            placeholder="Filter by Subject..."
                            name="subject"
                            value={filters.subject}
                            onChange={handleFilterChange}
                            fullWidth
                            className="bg-base-100/50"
                        />
                        <Input
                            leftIcon={MapPin}
                            placeholder="Filter by Location..."
                            name="location"
                            value={filters.location}
                            onChange={handleFilterChange}
                            fullWidth
                            className="bg-base-100/50"
                        />
                        <Input
                            leftIcon={Search}
                            placeholder="Filter by Class..."
                            name="class"
                            value={filters.class}
                            onChange={handleFilterChange}
                            fullWidth
                            className="bg-base-100/50"
                        />
                    </div>
                </Card>
            </motion.div>

            {/* Tuition List */}
            {loading ? (
                <Spinner variant="dots" className="min-h-[300px]" />
            ) : tuitions.length === 0 ? (
                <div className="text-center py-16 bg-base-100/50 rounded-2xl border border-base-200 border-dashed">
                    <div className="flex justify-center mb-4 opacity-50"><Search size={48} /></div>
                    <h3 className="text-lg font-bold text-base-content/70">No tuitions found</h3>
                    <p className="text-base-content/50">Try adjusting your search filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {tuitions.map((item, index) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                                <Card hover glass className="h-full flex flex-col justify-between border-t-4 border-t-secondary/50">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="text-xl font-bold text-secondary font-heading">{item.subject}</h2>
                                                <p className="text-xs font-bold uppercase tracking-wider text-base-content/50 bg-base-200 inline-block px-2 py-1 rounded mt-1">Class {item.class}</p>
                                            </div>
                                            <div className="badge badge-outline text-xs opacity-70">{item.days} days/week</div>
                                        </div>

                                        <div className="space-y-2 py-2">
                                            <div className="flex items-center gap-2 text-sm text-base-content/80">
                                                <MapPin size={16} className="text-primary" />
                                                <span className="truncate">{item.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-base-content/80">
                                                <DollarSign size={16} className="text-success" />
                                                <span className="font-bold text-success">৳ {item.salary}</span> <span className="text-xs opacity-60">/month</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 mt-2 border-t border-base-200/50">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleApplyClick(item)}
                                            className="w-full shadow-lg shadow-primary/20"
                                            rightIcon={Send}
                                        >
                                            Apply Now
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Application Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Apply for ${selectedTuition?.subject}`}
                maxWidth="max-w-xl"
            >
                <form onSubmit={handleApplicationSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Name"
                            value={user?.displayName || ''}
                            readOnly
                            disabled
                            className="opacity-70"
                        />
                        <Input
                            label="Email"
                            value={user?.email || ''}
                            readOnly
                            disabled
                            className="opacity-70"
                        />
                    </div>

                    <div className="form-control">
                        <label className="label font-medium"><span className="label-text flex items-center gap-2"><Briefcase size={16} /> Experience</span></label>
                        <textarea
                            className="textarea textarea-bordered h-24 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="Briefly describe your teaching experience..."
                            value={applicationData.experience}
                            onChange={(e) => setApplicationData({ ...applicationData, experience: e.target.value })}
                            required
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Highest Qualification"
                            placeholder="e.g. B.Sc in Math"
                            leftIcon={GraduationCap}
                            value={applicationData.qualification}
                            onChange={(e) => setApplicationData({ ...applicationData, qualification: e.target.value })}
                            required
                        />
                        <Input
                            label="Expected Salary"
                            type="number"
                            placeholder="e.g. 5000"
                            leftIcon={DollarSign}
                            value={applicationData.expectedSalary}
                            onChange={(e) => setApplicationData({ ...applicationData, expectedSalary: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="ghost"
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            isLoading={isSubmitting}
                            rightIcon={Send}
                        >
                            Submit Application
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AvailableTuitions;
