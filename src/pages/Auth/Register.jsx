import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, Upload, UserPlus, CheckCircle, GraduationCap, Briefcase } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { ROLES } from '../../utils/constants';
import { uploadImage } from '../../utils/uploadImage';
import axiosInstance from '../../utils/axiosInstance';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: ROLES.STUDENT, // Default role
    });

    const [photo, setPhoto] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const { createUser, updateUserProfile } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image size should be less than 2MB");
                return;
            }
            setPhoto(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            // 1. Create User in Firebase
            const result = await createUser(formData.email, formData.password);
            const user = result.user;

            // 2. Upload Photo if selected
            let photoURL = '';
            if (photo) {
                photoURL = await uploadImage(photo, 'user-profiles');
            }

            // 3. Update Firebase Profile
            await updateUserProfile(formData.name, photoURL);

            // 4. Save User to Backend Database
            const userData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                role: formData.role,
                photoURL: photoURL,
                firebaseId: user.uid,
            };

            // Mock backend call if server not ready - Replace with actual API call later
            // For now, we assume success or try to call the endpoint
            try {
                // Correct Endpoint: /user
                await axiosInstance.post('/user', userData);
                localStorage.setItem('userRole', formData.role); // Important: Persist role locally for frontend state
                toast.success(`Welcome, ${formData.name}! Registration successful.`);
                navigate('/');
            } catch (backendError) {
                console.warn("Backend registration failed (Server might be down), but Firebase Auth created.", backendError);
                // Even if backend fails, strictly for this frontend demo, we persist role locally
                localStorage.setItem('userRole', formData.role);
                toast.error("Account created in Firebase, but failed to save to database.");
            }

        } catch (error) {
            console.error(error);
            let msg = 'Registration failed';
            if (error.code === 'auth/email-already-in-use') msg = 'Email already in use';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-base-200/30 py-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="card w-full max-w-2xl bg-base-100 shadow-xl border border-base-200 overflow-hidden"
            >
                <div className="flex flex-col md:flex-row">
                    {/* Left Side - Info */}
                    <div className="md:w-2/5 bg-primary text-primary-content p-8 flex flex-col justify-between hidden md:flex">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Join Us Today</h2>
                            <p className="opacity-90 mb-8">Create an account to start your journey with eTuitionBd.</p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle size={20} /> <span className="text-sm">Verified Tutors</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle size={20} /> <span className="text-sm">Secure Payments</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle size={20} /> <span className="text-sm">Instant Connections</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-xs opacity-70 mt-8">
                            &copy; 2024 eTuitionBd
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="md:w-3/5 p-8">
                        <h2 className="text-2xl font-bold text-center md:text-left mb-6 text-gray-800">Create Account</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Role Selection */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div
                                    onClick={() => setFormData({ ...formData, role: ROLES.STUDENT })}
                                    className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${formData.role === ROLES.STUDENT ? 'border-primary bg-primary/5 ring-2 ring-primary ring-offset-1' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <GraduationCap size={24} className={formData.role === ROLES.STUDENT ? 'text-primary' : 'text-gray-400'} />
                                    <span className={`font-medium text-sm ${formData.role === ROLES.STUDENT ? 'text-primary' : 'text-gray-600'}`}>I am a Student</span>
                                </div>
                                <div
                                    onClick={() => setFormData({ ...formData, role: ROLES.TUTOR })}
                                    className={`cursor-pointer border rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-all ${formData.role === ROLES.TUTOR ? 'border-secondary bg-secondary/5 ring-2 ring-secondary ring-offset-1' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <Briefcase size={24} className={formData.role === ROLES.TUTOR ? 'text-secondary' : 'text-gray-400'} />
                                    <span className={`font-medium text-sm ${formData.role === ROLES.TUTOR ? 'text-secondary' : 'text-gray-600'}`}>I am a Tutor</span>
                                </div>
                            </div>

                            <Input
                                label="Full Name"
                                name="name"
                                placeholder="John Doe"
                                icon={<User size={18} />}
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="john@example.com"
                                icon={<Mail size={18} />}
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="Phone Number"
                                name="phone"
                                placeholder="+880 1xxx xxxxxx"
                                icon={<Phone size={18} />}
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••"
                                    icon={<Lock size={18} />}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••"
                                    icon={<Lock size={18} />}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* File Upload */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">Profile Photo</span>
                                </label>
                                <label className="flex items-center gap-4 cursor-pointer">
                                    <div className="w-16 h-16 rounded-full bg-base-200 border border-dashed border-gray-400 flex items-center justify-center overflow-hidden shrink-0">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <Upload size={24} className="text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            className="file-input file-input-bordered file-input-sm w-full"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Recommended: Square image, max 2MB</p>
                                    </div>
                                </label>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full mt-4"
                                loading={loading}
                                disabled={loading}
                            >
                                Create Account <UserPlus size={18} className="ml-2" />
                            </Button>
                        </form>

                        <p className="text-center mt-6 text-sm text-gray-600">
                            Already have an account?
                            <Link to="/login" className="text-primary font-bold hover:underline ml-1">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
