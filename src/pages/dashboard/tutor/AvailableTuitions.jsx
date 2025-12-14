import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useToast from '../../../hooks/useToast';
import { Search, MapPin, BookOpen, DollarSign, Send } from 'lucide-react';
import Swal from 'sweetalert2';

const AvailableTuitions = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { showToast } = useToast();
    const [tuitions, setTuitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        subject: '',
        location: '',
        class: ''
    });

    // Application Modal State
    const [selectedTuition, setSelectedTuition] = useState(null);
    const [applicationData, setApplicationData] = useState({
        experience: '',
        qualification: '',
        expectedSalary: ''
    });

    const fetchTuitions = async () => {
        setLoading(true);
        try {
            // Build query string
            let query = `?status=approved`; // Show Admin-approved tuitions
            if (filters.subject) query += `&subject=${filters.subject}`;
            if (filters.location) query += `&location=${filters.location}`;
            if (filters.class) query += `&class=${filters.class}`;

            const res = await axiosSecure.get(`/tuitions-post${query}`);
            setTuitions(res.data); // Backend now returns array directly for GET /tuitions-post
        } catch (error) {
            console.error(error);
            showToast('Failed to fetch tuitions', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTuitions();
    }, [filters.subject, filters.location, filters.class, axiosSecure]); // Auto-fetch on filter change or use a separate search button

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
        document.getElementById('application_modal').showModal();
    };

    const handleApplicationSubmit = async (e) => {
        e.preventDefault();

        // 1. Ask for Confirmation
        const result = await Swal.fire({
            title: 'Send Application?',
            text: "Are you sure you want to submit this application?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, send it!'
        });

        if (!result.isConfirmed) return;

        try {
            const payload = {
                tuitionId: selectedTuition._id,
                ...applicationData
            };
            const res = await axiosSecure.post('/apply-tuition', payload);
            if (res.data.insertedId) {
                // Success Toast
                Swal.fire(
                    'Sent!',
                    'Your application has been sent to the student.',
                    'success'
                );
                document.getElementById('application_modal').close();
                // Optionally remove the applied tuition from list or mark as applied
            }
        } catch (error) {
            console.error(error);
            if (error.response?.status === 409) {
                showToast('You have already applied to this tuition.', 'warning');
            } else {
                showToast('Failed to submit application.', 'error');
            }
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Available Tuitions</h1>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-base-100 p-4 rounded-xl shadow-sm border border-base-200">
                <div className="form-control">
                    <div className="input-group flex items-center bg-base-200 rounded-lg px-3">
                        <BookOpen size={18} className="text-gray-500" />
                        <input
                            type="text"
                            name="subject"
                            placeholder="Filter by Subject"
                            className="input input-ghost w-full focus:outline-none focus:bg-transparent"
                            value={filters.subject}
                            onChange={handleFilterChange}
                        />
                    </div>
                </div>
                <div className="form-control">
                    <div className="input-group flex items-center bg-base-200 rounded-lg px-3">
                        <MapPin size={18} className="text-gray-500" />
                        <input
                            type="text"
                            name="location"
                            placeholder="Filter by Location"
                            className="input input-ghost w-full focus:outline-none focus:bg-transparent"
                            value={filters.location}
                            onChange={handleFilterChange}
                        />
                    </div>
                </div>
                <div className="form-control">
                    <div className="input-group flex items-center bg-base-200 rounded-lg px-3">
                        <Search size={18} className="text-gray-500" />
                        <input
                            type="text"
                            name="class"
                            placeholder="Filter by Class"
                            className="input input-ghost w-full focus:outline-none focus:bg-transparent"
                            value={filters.class}
                            onChange={handleFilterChange}
                        />
                    </div>
                </div>
            </div>

            {/* Tuition List */}
            {loading ? (
                <div className="flex justify-center p-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>
            ) : tuitions.length === 0 ? (
                <div className="text-center py-10 bg-base-100 rounded-xl border border-base-200">
                    <p className="text-gray-500">No approved tuitions found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tuitions.map((item) => (
                        <div key={item._id} className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow">
                            <div className="card-body">
                                <h2 className="card-title text-primary">{item.subject}</h2>
                                <h3 className="text-sm font-semibold text-gray-500">Class: {item.class}</h3>

                                <div className="space-y-2 mt-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin size={16} /> {item.location}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <DollarSign size={16} /> Salary: BDT {item.salary}
                                    </div>
                                </div>

                                <div className="card-actions justify-end mt-4">
                                    <button
                                        className="btn btn-primary btn-sm gap-2"
                                        onClick={() => handleApplyClick(item)}
                                    >
                                        <Send size={16} /> Apply Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Application Modal */}
            <dialog id="application_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Apply for {selectedTuition?.subject}</h3>
                    <form onSubmit={handleApplicationSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Name</span></label>
                                <input type="text" value={user?.displayName || ''} className="input input-bordered w-full bg-base-200" readOnly />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text">Email</span></label>
                                <input type="text" value={user?.email || ''} className="input input-bordered w-full bg-base-200" readOnly />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text">Experience</span></label>
                            <textarea
                                className="textarea textarea-bordered h-24"
                                placeholder="Write briefly about your experience..."
                                value={applicationData.experience}
                                onChange={(e) => setApplicationData({ ...applicationData, experience: e.target.value })}
                                required
                            ></textarea>
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Qualification</span></label>
                            <input
                                type="text"
                                placeholder="Your highest qualification"
                                className="input input-bordered"
                                value={applicationData.qualification}
                                onChange={(e) => setApplicationData({ ...applicationData, qualification: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Expected Salary</span></label>
                            <input
                                type="number"
                                placeholder="Your expected salary"
                                className="input input-bordered"
                                value={applicationData.expectedSalary}
                                onChange={(e) => setApplicationData({ ...applicationData, expectedSalary: e.target.value })}
                                required
                            />
                        </div>
                        <div className="modal-action">
                            <button type="button" className="btn" onClick={() => document.getElementById('application_modal').close()}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Submit Application</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default AvailableTuitions;
