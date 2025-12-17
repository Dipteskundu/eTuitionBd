import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, Upload, UserPlus, CheckCircle, GraduationCap, Briefcase } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
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
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 gradient-bg py-10">
            {/* Floating Orbs */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary rounded-full blur-3xl animate-float animation-delay-300" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl relative z-10"
            >
                <Card glass className="overflow-hidden">
                    <div className="p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h2 className="font-heading text-4xl font-bold gradient-text mb-2">
                                    Join Us Today
                                </h2>
                                <p className="text-base-content/60">
                                    Create your account and start your journey
                                </p>
                            </motion.div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Role Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setFormData({ ...formData, role: ROLES.STUDENT })}
                                    className={`cursor-pointer rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all ${formData.role === ROLES.STUDENT
                                        ? 'bg-primary/10 ring-2 ring-primary shadow-glow'
                                        : 'bg-base-200/50 hover:bg-base-200'
                                        }`}
                                >
                                    <GraduationCap
                                        size={32}
                                        className={formData.role === ROLES.STUDENT ? 'text-primary' : 'text-base-content/40'}
                                    />
                                    <span
                                        className={`font-heading font-semibold ${formData.role === ROLES.STUDENT ? 'text-primary' : 'text-base-content/70'
                                            }`}
                                    >
                                        I'm a Student
                                    </span>
                                    <p className="text-xs text-base-content/50 text-center">
                                        Find qualified tutors
                                    </p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setFormData({ ...formData, role: ROLES.TUTOR })}
                                    className={`cursor-pointer rounded-xl p-4 flex flex-col items-center justify-center gap-3 transition-all ${formData.role === ROLES.TUTOR
                                        ? 'bg-secondary/10 ring-2 ring-secondary shadow-glow'
                                        : 'bg-base-200/50 hover:bg-base-200'
                                        }`}
                                >
                                    <Briefcase
                                        size={32}
                                        className={formData.role === ROLES.TUTOR ? 'text-secondary' : 'text-base-content/40'}
                                    />
                                    <span
                                        className={`font-heading font-semibold ${formData.role === ROLES.TUTOR ? 'text-secondary' : 'text-base-content/70'
                                            }`}
                                    >
                                        I'm a Tutor
                                    </span>
                                    <p className="text-xs text-base-content/50 text-center">
                                        Teach students
                                    </p>
                                </motion.div>
                            </div>

                            <Input
                                floating
                                label="Full Name"
                                name="name"
                                leftIcon={<User size={18} />}
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                floating
                                label="Email Address"
                                name="email"
                                type="email"
                                leftIcon={<Mail size={18} />}
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                floating
                                label="Phone Number"
                                name="phone"
                                leftIcon={<Phone size={18} />}
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Password"
                                    name="password"
                                    type="password"
                                    leftIcon={<Lock size={18} />}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type="password"
                                    leftIcon={<Lock size={18} />}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* File Upload */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-medium">Profile Photo (Optional)</span>
                                </label>
                                <label className="flex items-center gap-4 cursor-pointer">
                                    <div className="w-16 h-16 rounded-full bg-base-200 border-2 border-dashed border-base-300 flex items-center justify-center overflow-hidden shrink-0 hover:border-primary transition-colors">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <Upload size={24} className="text-base-content/40" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            className="file-input file-input-bordered file-input-sm w-full"
                                        />
                                        <p className="text-xs text-base-content/50 mt-1">Max 2MB, square image recommended</p>
                                    </div>
                                </label>
                            </div>

                            <Button
                                type="submit"
                                variant="gradient"
                                size="lg"
                                fullWidth
                                loading={loading}
                                disabled={loading}
                                rightIcon={<UserPlus size={18} />}
                                className="mt-6"
                            >
                                Create Account
                            </Button>
                        </form>

                        {/* Login Link */}
                        <p className="text-center mt-6 text-sm text-base-content/70">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary font-semibold hover:underline">
                                Login
                            </Link>
                        </p>

                        {/* Trust Indicators */}
                        <div className="flex items-center justify-center gap-6 mt-8 text-xs text-base-content/60">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-primary" />
                                <span>Verified Tutors</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-secondary" />
                                <span>Secure Platform</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-accent" />
                                <span>Free Registration</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default Register;
