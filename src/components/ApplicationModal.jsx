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
        <Modal isOpen={isOpen} onClose={onClose} title="Apply for Tuition" size="lg">
            <div className="bg-primary p-8 text-white rounded-t-2xl -mt-6 -mx-6 mb-8 shadow-inner">
                <h2 className="text-3xl font-heading font-bold mb-1">Apply for Tuition</h2>
                <div className="flex items-center gap-2 opacity-90 text-sm font-medium bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                    <FileText size={14} /> {tuition.subject} | Class {tuition.class}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                        <label className="label py-0 mb-2">
                            <span className="label-text font-bold text-base-content/70">My Name</span>
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/30 group-focus-within:text-primary transition-colors">
                                <User size={18} />
                            </div>
                            <input type="text" value={user?.displayName || ''} readOnly className="input input-bordered w-full pl-10 bg-base-200/50 border-base-200 text-base-content/50 cursor-not-allowed font-medium" />
                        </div>
                    </div>
                    <div className="form-control">
                        <label className="label py-0 mb-2">
                            <span className="label-text font-bold text-base-content/70">My Email</span>
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/30 group-focus-within:text-primary transition-colors">
                                <Mail size={18} />
                            </div>
                            <input type="text" value={user?.email || ''} readOnly className="input input-bordered w-full pl-10 bg-base-200/50 border-base-200 text-base-content/50 cursor-not-allowed font-medium" />
                        </div>
                    </div>
                </div>

                <div className="form-control">
                    <label className="label py-0 mb-2">
                        <span className="label-text font-bold text-base-content/70">Message to Guardian</span>
                    </label>
                    <textarea
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Why are you the best fit? (e.g. experience, approach)"
                        className="textarea textarea-bordered w-full min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-base leading-relaxed"
                    ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                        <label className="label py-0 mb-2">
                            <span className="label-text font-bold text-base-content/70">Availability</span>
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/30 group-focus-within:text-primary transition-colors">
                                <Clock size={18} />
                            </div>
                            <input
                                type="text"
                                value={availability}
                                onChange={(e) => setAvailability(e.target.value)}
                                placeholder="e.g. Mon, Wed, Fri (3pm-5pm)"
                                className="input input-bordered w-full pl-10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label py-0 mb-2">
                            <span className="label-text font-bold text-base-content/70">Expected Salary (BDT)</span>
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/30 group-focus-within:text-primary transition-colors font-bold">
                                ৳
                            </div>
                            <input
                                required
                                type="number"
                                value={expectedSalary}
                                onChange={(e) => setExpectedSalary(e.target.value)}
                                className="input input-bordered w-full pl-10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        className="order-2 sm:order-1 flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        isLoading={loading}
                        leftIcon={Send}
                        variant="primary"
                        className="order-1 sm:order-2 flex-1 shadow-lg shadow-primary/20"
                    >
                        Submit Application
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ApplicationModal;
