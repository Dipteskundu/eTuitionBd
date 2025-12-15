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
            tutorId: user.email,
            message: qualifications, // Mapping UI field to API expectation
            availability: experience,  // Mapping UI field to API expectation
            expectedSalary: parseInt(expectedSalary),
        };

        try {
            await axiosSecure.post('/tuition-application', payload);
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
                        <label className="label font-medium text-gray-700 dark:text-gray-300">Message to Guardian</label>
                        <textarea
                            required
                            value={qualifications} // Reusing state var 'qualifications' as 'message' or adding new one? 
                            // Creating new state variable 'message' is better but I have to define it at top.
                            // I will use 'qualifications' as 'Message' for now based on context or rename it?
                            // Better: Add new state 'message' in next step or rename here? 
                            // Quickest: Rename the label for 'qualifications' to 'Message / Qualifications' or keep it structure.
                            // Prompt says "Message". I'll rename the label and use the variable 'qualifications' as the message body for now to minimal change, or properly Add 'message'.
                            // Let's add 'message' properly requires state update. I'll assume I can just add inputs.
                            // Wait, tool doesn't let me update Top of function state easily without big Replace.
                            // I'll update the whole file content for safety or use multi-replace.
                            onChange={(e) => setQualifications(e.target.value)}
                            placeholder="Why are you the best fit? (e.g. experience, approach)"
                            className="textarea textarea-bordered w-full h-24"
                        ></textarea>
                    </div>

                    <div className="form-control">
                        <label className="label font-medium text-gray-700 dark:text-gray-300">Availability</label>
                        <input
                            type="text"
                            value={experience} // Reusing 'experience' state as 'availability' for minimal refactor or just label change?
                            // This modal originally had Qualifications & Experience. Prompt asks for Message & Availability.
                            // I will repurpose: Qualifications -> Message, Experience -> Availability.
                            onChange={(e) => setExperience(e.target.value)}
                            placeholder="e.g. Mon, Wed, Fri (3pm - 5pm)"
                            className="input input-bordered w-full"
                        />
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
