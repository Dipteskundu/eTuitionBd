import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useToast from '../../../hooks/useToast';
import { Save, BookOpen, MapPin, DollarSign, Calendar, Clock, User, FileText } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Card from '../../../components/ui/Card';
import { motion } from 'framer-motion';

const PostTuition = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { success: toastSuccess, error: toastError } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const tuitionData = {
                ...data,
                studentName: user?.displayName,
                studentEmail: user?.email,
                studentPhoto: user?.photoURL,
                salary: parseFloat(data.salary),
                class: data.class,
            };

            const res = await axiosSecure.post('/tuitions-post', tuitionData);
            if (res.data.insertedId) {
                toastSuccess('Tuition posted successfully!');
                navigate('/dashboard/student/my-tuitions');
            }
        } catch (error) {
            console.error(error);
            toastError('Failed to post tuition.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-primary-500/10 to-secondary-500/10 p-6 rounded-2xl border border-primary-500/20 mb-8 backdrop-blur-sm">
                    <div>
                        <h1 className="text-3xl font-heading font-bold gradient-text">Post a Requirement</h1>
                        <p className="text-base-content/70 mt-1">Fill in the details to find the perfect tutor.</p>
                    </div>
                    <div className="hidden md:block">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner">
                            <BookOpen className="text-primary w-8 h-8" />
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
            >
                <Card glass className="p-8 relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
                        {/* Section 1: Academic Details */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-primary border-b border-base-200 pb-2">
                                <BookOpen size={20} /> Academic Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Subject"
                                    placeholder="e.g. Mathematics, English, Physics"
                                    leftIcon={BookOpen}
                                    fullWidth
                                    error={errors.subject?.message}
                                    {...register("subject", { required: "Subject is required" })}
                                />

                                <Select
                                    label="Class / Grade"
                                    placeholder="Select Class"
                                    error={errors.class?.message}
                                    options={[
                                        "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
                                        "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
                                        "SSC", "HSC", "O Level", "A Level"
                                    ]}
                                    {...register("class", { required: "Class is required" })}
                                />

                                <Select
                                    label="Medium"
                                    placeholder="Select Medium"
                                    error={errors.medium?.message}
                                    options={[
                                        "Bengali Medium", "English Version", "English Medium", "Madrasa"
                                    ]}
                                    {...register("medium", { required: "Medium is required" })}
                                />
                            </div>
                        </div>

                        {/* Section 2: Logistics */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-secondary border-b border-base-200 pb-2">
                                <MapPin size={20} /> Logistics & Compensation
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Location"
                                    placeholder="e.g. Dhanmondi, Dhaka"
                                    leftIcon={MapPin}
                                    fullWidth
                                    error={errors.location?.message}
                                    {...register("location", { required: "Location is required" })}
                                />

                                <Input
                                    label="Monthly Salary (BDT)"
                                    type="number"
                                    placeholder="e.g. 5000"
                                    leftIcon={DollarSign}
                                    fullWidth
                                    error={errors.salary?.message}
                                    {...register("salary", { required: "Salary is required", min: { value: 500, message: "Minimum 500 BDT" } })}
                                />

                                <Select
                                    label="Days Per Week"
                                    placeholder="Select Days"
                                    error={errors.daysPerWeek?.message}
                                    options={[
                                        { value: "2", label: "2 Days/Week" },
                                        { value: "3", label: "3 Days/Week" },
                                        { value: "4", label: "4 Days/Week" },
                                        { value: "5", label: "5 Days/Week" },
                                        { value: "6", label: "6 Days/Week" }
                                    ]}
                                    {...register("daysPerWeek", { required: "Please select days" })}
                                />

                                <Input
                                    label="Preferred Time"
                                    type="time"
                                    leftIcon={Clock}
                                    fullWidth
                                    error={errors.preferredTime?.message}
                                    {...register("preferredTime", { required: "Preferred time is required" })}
                                />
                            </div>
                        </div>

                        {/* Section 3: Preferences */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-accent border-b border-base-200 pb-2">
                                <User size={20} /> Preferences
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Select
                                    label="Tutor Gender Preference"
                                    placeholder="Select Gender"
                                    options={["Any", "Male", "Female"]}
                                    {...register("tutorGender")}
                                />
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-medium text-base-content/80 flex items-center gap-2">
                                        <FileText size={16} /> Other Requirements (Optional)
                                    </span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered h-32 bg-base-100/50 focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                                    placeholder="e.g. Experience required, Specific university student, etc."
                                    {...register("requirements")}
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-6 mt-8 border-t border-base-200/50">
                            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
                            <Button
                                type="submit"
                                variant="gradient"
                                isLoading={loading}
                                size="lg"
                                leftIcon={Save}
                                className="px-8 shadow-lg shadow-primary/20"
                            >
                                Post Tuition
                            </Button>
                        </div>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
};

export default PostTuition;
