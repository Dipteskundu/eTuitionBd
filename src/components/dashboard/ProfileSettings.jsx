import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Camera, Save, Lock, User, Phone, Mail, UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { motion } from 'framer-motion';

const ProfileSettings = () => {
    const { user, updateUserProfile, updateUserPassword } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, reset, control, watch, formState: { errors } } = useForm({
        mode: 'onSubmit'
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch latest data from backend as requested
                const response = await axiosSecure.get('/user/profile');
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
        setIsSubmitting(true);
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
                    setIsSubmitting(false);
                    return;
                }
            }

            // 4. Update Backend Database (PUT request as requested)
            const updatePayload = {
                displayName: data.displayName,
                photoURL: photoURL,
                phone: data.phoneNumber,
            };

            await axiosSecure.put('/user/profile', updatePayload);

            toast.success("Profile Updated Successfully!", { id: toastId });

        } catch (error) {
            console.error("Profile Update Error:", error);
            toast.error(error.message || "Failed to update profile", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading && !imagePreview) { // Initial loading state
        return <Spinner variant="dots" className="min-h-[400px]" />;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-4xl mx-auto"
        >
            <Card glass className="border-t-4 border-t-primary">
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold font-heading">Profile Settings</h2>
                        <p className="text-base-content/60 text-sm">Manage your account information and preferences.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Profile Picture Section */}
                    <div className="flex flex-col items-center justify-center p-6 bg-base-200/50 rounded-2xl border border-base-200 border-dashed">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-base-100 ring-4 ring-primary/20 shadow-xl">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-base-300 flex items-center justify-center text-base-content/30">
                                        <User size={48} />
                                    </div>
                                )}
                            </div>
                            <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-primary text-white p-2.5 rounded-full shadow-lg cursor-pointer hover:bg-primary-focus transition-all transform hover:scale-110 active:scale-95">
                                <Camera size={20} />
                            </label>
                            <input
                                type="file"
                                id="profile-upload"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </div>
                        <p className="mt-4 text-sm font-medium text-base-content/70">
                            {selectedImage ? selectedImage.name : "Click the camera icon to update photo"}
                        </p>
                    </div>

                    {/* Personal Details */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold flex items-center gap-2 border-b border-base-200 pb-2 text-primary">
                            <User size={20} /> Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Controller
                                name="displayName"
                                control={control}
                                rules={{ required: "Name is required" }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Full Name"
                                        placeholder="e.g. John Doe"
                                        leftIcon={User}
                                        error={errors.displayName?.message}
                                        fullWidth
                                    />
                                )}
                            />
                            <Input
                                label="Email Address"
                                leftIcon={Mail}
                                value={user?.email}
                                fullWidth
                                disabled
                                className="opacity-70 cursor-not-allowed"
                            />
                            <Input
                                label="Phone Number"
                                placeholder="e.g. +880 1XXX XXXXXX"
                                leftIcon={Phone}
                                error={errors.phoneNumber}
                                fullWidth
                                {...register("phoneNumber", {
                                    pattern: {
                                        value: /^\+?[0-9]{10,15}$/,
                                        message: "Invalid phone number format"
                                    }
                                })}
                            />
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold flex items-center gap-2 border-b border-base-200 pb-2 text-primary">
                            <Lock size={20} /> Security
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                type="password"
                                label="New Password"
                                placeholder="Leave blank to keep current"
                                leftIcon={Lock}
                                error={errors.newPassword}
                                fullWidth
                                togglePassword
                                {...register("newPassword", { minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                            />
                            <Input
                                type="password"
                                label="Confirm New Password"
                                placeholder="Re-enter new password"
                                leftIcon={Lock}
                                fullWidth
                                togglePassword
                                {...register("confirmPassword")}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end pt-6 border-t border-base-200">
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            isLoading={isSubmitting}
                            leftIcon={Save}
                            className="w-full md:w-auto min-w-[150px] shadow-lg shadow-primary/20"
                        >
                            Save Changes
                        </Button>
                    </div>

                </form>
            </Card>
        </motion.div>
    );
};

export default ProfileSettings;
