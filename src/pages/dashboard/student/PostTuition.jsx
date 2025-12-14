import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useToast from '../../../hooks/useToast';
import { Save, Loader2 } from 'lucide-react';
import Button from '../../../components/ui/Button';

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
                class: data.class, // Ensure class is stored as string/number as needed
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
        <div className="max-w-4xl mx-auto bg-base-100 p-8 rounded-xl shadow-md border border-base-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Post a Tuition Requirement</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Subject */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Subject</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Mathematics, English, Physics"
                            className={`input input-bordered w-full ${errors.subject ? 'input-error' : ''}`}
                            {...register("subject", { required: "Subject is required" })}
                        />
                        {errors.subject && <span className="text-error text-sm mt-1">{errors.subject.message}</span>}
                    </div>

                    {/* Class/Grade */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Class / Grade</span>
                        </label>
                        <select
                            className={`select select-bordered w-full ${errors.class ? 'select-error' : ''}`}
                            {...register("class", { required: "Class is required" })}
                        >
                            <option value="">Select Class</option>
                            <option value="Class 1">Class 1</option>
                            <option value="Class 2">Class 2</option>
                            <option value="Class 3">Class 3</option>
                            <option value="Class 4">Class 4</option>
                            <option value="Class 5">Class 5</option>
                            <option value="Class 6">Class 6</option>
                            <option value="Class 7">Class 7</option>
                            <option value="Class 8">Class 8</option>
                            <option value="Class 9">Class 9</option>
                            <option value="Class 10">Class 10</option>
                            <option value="SSC">SSC Candidate</option>
                            <option value="HSC">HSC Candidate</option>
                            <option value="O Level">O Level</option>
                            <option value="A Level">A Level</option>
                        </select>
                        {errors.class && <span className="text-error text-sm mt-1">{errors.class.message}</span>}
                    </div>

                    {/* Medium */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Medium</span>
                        </label>
                        <select
                            className={`select select-bordered w-full ${errors.medium ? 'select-error' : ''}`}
                            {...register("medium", { required: "Medium is required" })}
                        >
                            <option value="">Select Medium</option>
                            <option value="Bengali Medium">Bengali Medium</option>
                            <option value="English Version">English Version</option>
                            <option value="English Medium">English Medium</option>
                            <option value="Madrasa">Madrasa</option>
                        </select>
                        {errors.medium && <span className="text-error text-sm mt-1">{errors.medium.message}</span>}
                    </div>

                    {/* Location */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Location</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Dhanmondi, Dhaka"
                            className={`input input-bordered w-full ${errors.location ? 'input-error' : ''}`}
                            {...register("location", { required: "Location is required" })}
                        />
                        {errors.location && <span className="text-error text-sm mt-1">{errors.location.message}</span>}
                    </div>

                    {/* Salary */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Monthly Salary (BDT)</span>
                        </label>
                        <input
                            type="number"
                            placeholder="e.g. 5000"
                            className={`input input-bordered w-full ${errors.salary ? 'input-error' : ''}`}
                            {...register("salary", { required: "Salary is required", min: { value: 500, message: "Minimum 500 BDT" } })}
                        />
                        {errors.salary && <span className="text-error text-sm mt-1">{errors.salary.message}</span>}
                    </div>

                    {/* Days Per Week */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Days Per Week</span>
                        </label>
                        <select
                            className={`select select-bordered w-full ${errors.daysPerWeek ? 'select-error' : ''}`}
                            {...register("daysPerWeek", { required: "Please select days" })}
                        >
                            <option value="">Select Days</option>
                            <option value="2">2 Days/Week</option>
                            <option value="3">3 Days/Week</option>
                            <option value="4">4 Days/Week</option>
                            <option value="5">5 Days/Week</option>
                            <option value="6">6 Days/Week</option>
                        </select>
                        {errors.daysPerWeek && <span className="text-error text-sm mt-1">{errors.daysPerWeek.message}</span>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Preferred Time */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Preferred Time</span>
                        </label>
                        <input
                            type="time"
                            className="input input-bordered w-full"
                            {...register("preferredTime", { required: "Preferred time is required" })}
                        />
                        {errors.preferredTime && <span className="text-error text-sm mt-1">{errors.preferredTime.message}</span>}
                    </div>

                    {/* Tutor Gender Preference */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Tutor Gender Preference</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
                            {...register("tutorGender")}
                        >
                            <option value="Any">Any Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                </div>

                {/* Additional Requirements */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-medium">Other Requirements (Optional)</span>
                    </label>
                    <textarea
                        className="textarea textarea-bordered h-24"
                        placeholder="e.g. Experience required, Specific university student, etc."
                        {...register("requirements")}
                    ></textarea>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                    <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost">Cancel</button>
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading && <Loader2 className="animate-spin mr-2" size={20} />}
                        Post Tuition
                    </Button>
                </div>

            </form>
        </div>
    );
};

export default PostTuition;
