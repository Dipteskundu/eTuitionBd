import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { Send, FileText, Clock, User, Mail, DollarSign } from 'lucide-react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';

const ApplicationModal = ({ isOpen, onClose, tuition, onSuccess }) => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(false);

    // Form Stats
    const [message, setMessage] = useState('');
    const [availability, setAvailability] = useState('');
    const [expectedSalary, setExpectedSalary] = useState(tuition?.salary || '');

    if (!tuition) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Confirmation Dialog
        const confirm = window.confirm("Do you want to send this application?");
        if (!confirm) return;

        setLoading(true);

        const payload = {
            tuitionId: tuition._id,
            tutorId: user.email,
            message: message,
            availability: availability,
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
        <Modal isOpen={isOpen} onClose={onClose} title="Apply for Tuition" maxWidth="max-w-xl">
            <div className="bg-purple-600 p-6 text-white rounded-t-2xl -mt-6 -mx-6 mb-6">
                <h2 className="text-2xl font-bold">Apply for Tuition</h2>
                <p className="opacity-90">{tuition.subject} | Class {tuition.class}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Why are you the best fit? (e.g. experience, approach)"
                        className="textarea textarea-bordered w-full h-24"
                    ></textarea>
                </div>

                <div className="form-control">
                    <label className="label font-medium text-gray-700 dark:text-gray-300">Availability</label>
                    <input
                        type="text"
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
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
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        isLoading={loading}
                        leftIcon={Send}
                        variant="primary"
                    >
                        Submit Application
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ApplicationModal;
