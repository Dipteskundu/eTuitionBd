import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import axiosInstance from '../../utils/axiosInstance';
import { Camera, Save, Lock, User, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfileSettings = () => {
    const { user, updateUserProfile, updateUserPassword } = useAuth();
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch latest data from backend as requested
                const response = await axiosInstance.get('/user/profile');
                const userData = response.data;

                reset({
                    displayName: userData.displayName || user?.displayName || '',
                    phoneNumber: userData.phone || '',
                    email: userData.email || user?.email || '', // Read only
                });
                setImagePreview(userData.photoURL || user?.photoURL);
            } catch (error) {
                console.error("Failed to fetch profile:", error);

                // Fallback to local auth data
                reset({
                    displayName: user?.displayName || '',
                    email: user?.email || '',
                });
                setImagePreview(user?.photoURL);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchUserData();
        }
    }, [user, reset]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadImageToImgBB = async (imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        const apiKey = import.meta.env.VITE_IMGBB_KEY || "41b8d648bab8220e8f6294966efc8ec2";

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                return data.data.url;
            } else {
                console.error("ImgBB Upload Failed:", data);
                throw new Error("Failed to upload image: " + (data.error?.message || "Unknown error"));
            }
        } catch (error) {
            console.error("ImgBB Network/API Error:", error);
            throw new Error("Image upload failed. Please try again or use a different image.");
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        const toastId = toast.loading("Updating profile...");
        try {
            let photoURL = imagePreview;

            // 1. Upload Image if selected
            if (selectedImage) {
                photoURL = await uploadImageToImgBB(selectedImage);
            }

            // 2. Update Firebase Profile (Name & Photo)
            await updateUserProfile(data.displayName, photoURL);

            // 3. Update Password if provided
            if (data.newPassword) {
                if (data.newPassword === data.confirmPassword) {
                    await updateUserPassword(data.newPassword);
                } else {
                    toast.error("Passwords do not match!", { id: toastId });
                    setLoading(false);
                    return;
                }
            }

            // 4. Update Backend Database (PUT request as requested)
            const updatePayload = {
                displayName: data.displayName,
                photoURL: photoURL,
                phone: data.phoneNumber,
            };

            await axiosInstance.put('/user/profile', updatePayload);

            toast.success("Profile Updated Successfully!", { id: toastId });

        } catch (error) {
            console.error("Profile Update Error:", error);
            toast.error(error.message || "Failed to update profile", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    if (loading && !imagePreview) { // Initial loading state
        return <div className="flex justify-center p-10"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-base-100 rounded-lg shadow-md border border-base-200">
            <h2 className="text-2xl font-bold mb-6 text-center lg:text-left">Profile Settings</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                {/* Profile Picture Section */}
                <div className="flex flex-col items-center lg:items-start gap-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile Picture</label>
                    <div className="relative group cursor-pointer">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-base-300 flex items-center justify-center">
                                    <User size={40} className="text-gray-400" />
                                </div>
                            )}
                        </div>
                        <label htmlFor="profile-upload" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                            <Camera className="text-white" />
                        </label>
                        <input
                            type="file"
                            id="profile-upload"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </div>
                </div>

                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-medium flex items-center gap-2"><User size={16} /> Full Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="input input-bordered w-full"
                            {...register("displayName", { required: "Name is required" })}
                        />
                        {errors.displayName && <span className="text-red-500 text-xs mt-1">{errors.displayName.message}</span>}
                    </div>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-medium flex items-center gap-2"><Mail size={16} /> Email</span>
                        </label>
                        <input
                            type="email"
                            readOnly
                            disabled
                            className="input input-bordered w-full bg-base-200 text-gray-500 cursor-not-allowed"
                            {...register("email")}
                        />
                        <label className="label">
                            <span className="label-text-alt text-gray-400">Email cannot be changed</span>
                        </label>
                    </div>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-medium flex items-center gap-2"><Phone size={16} /> Phone Number</span>
                        </label>
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            className="input input-bordered w-full"
                            {...register("phoneNumber", {
                                pattern: {
                                    value: /^\+?[0-9]{10,15}$/,
                                    message: "Invalid phone number format"
                                }
                            })}
                        />
                        {errors.phoneNumber && <span className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</span>}
                    </div>
                </div>

                <div className="divider">Security</div>

                {/* Password Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-medium flex items-center gap-2"><Lock size={16} /> New Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Leave blank to keep current"
                            className="input input-bordered w-full"
                            {...register("newPassword", { minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                        />
                        {errors.newPassword && <span className="text-red-500 text-xs mt-1">{errors.newPassword.message}</span>}
                    </div>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-medium flex items-center gap-2"><Lock size={16} /> Confirm New Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            className="input input-bordered w-full"
                            {...register("confirmPassword")}
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`btn btn-primary px-8 ${loading ? 'loading' : ''}`}
                    >
                        {loading ? 'Updating...' : (
                            <>
                                <Save size={18} /> Save Changes
                            </>
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default ProfileSettings;
