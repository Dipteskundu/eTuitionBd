import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const ApplicationModal = ({ isOpen, onClose, tuition, onSuccess }) => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(false);

    // Form Stats
    const [qualifications, setQualifications] = useState('');
    const [experience, setExperience] = useState('');
    const [expectedSalary, setExpectedSalary] = useState(tuition?.salary || '');

    if (!isOpen || !tuition) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Confirmation Dialog
        const confirm = window.confirm("Do you want to send this application?");
        if (!confirm) return;

        setLoading(true);

        const payload = {
            tuitionId: tuition._id,
            tutorId: user.email, // Using email as ID often in this system
            // But API reads token, so just sending body fields
            qualifications,
            experience,
            expectedSalary: parseInt(expectedSalary),
        };

        try {
            await axiosSecure.post('/apply-tuition', payload);
            toast.success("Application sent successfully!");
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            if (error.response?.status === 409) {
                toast.error("You have already applied for this tuition.");
            } else {
                toast.error("Failed to submit application.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in">
                <div className="bg-purple-600 p-6 text-white">
                    <h2 className="text-2xl font-bold">Apply for Tuition</h2>
                    <p className="opacity-90">{tuition.subject} | Class {tuition.class}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Read Only Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label font-medium text-gray-700 dark:text-gray-300">Name</label>
                            <input type="text" value={user?.displayName || ''} readOnly className="input input-bordered w-full bg-gray-100 dark:bg-gray-700 cursor-not-allowed" />
                        </div>
                        <div className="form-control">
                            <label className="label font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <input type="text" value={user?.email || ''} readOnly className="input input-bordered w-full bg-gray-100 dark:bg-gray-700 cursor-not-allowed" />
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="form-control">
                        <label className="label font-medium text-gray-700 dark:text-gray-300">Qualifications</label>
                        <textarea
                            required
                            value={qualifications}
                            onChange={(e) => setQualifications(e.target.value)}
                            placeholder="Type your qualifications..."
                            className="textarea textarea-bordered w-full h-20"
                        ></textarea>
                    </div>

                    <div className="form-control">
                        <label className="label font-medium text-gray-700 dark:text-gray-300">Experience</label>
                        <textarea
                            required
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            placeholder="Describe your teaching experience..."
                            className="textarea textarea-bordered w-full h-20"
                        ></textarea>
                    </div>

                    <div className="form-control">
                        <label className="label font-medium text-gray-700 dark:text-gray-300">Expected Salary (BDT)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">৳</span>
                            <input
                                required
                                type="number"
                                value={expectedSalary}
                                onChange={(e) => setExpectedSalary(e.target.value)}
                                className="input input-bordered w-full pl-8"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 dark:shadow-none flex items-center gap-2"
                        >
                            {loading ? "Sending..." : "Submit Application"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplicationModal;
