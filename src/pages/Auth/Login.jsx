import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Chrome, AlertCircle } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import axiosInstance from '../../utils/axiosInstance';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onChange'
    });
    const [loading, setLoading] = useState(false);

    const { signIn, signInGoogle } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await signIn(data.email, data.password);
            toast.success('Login successful! Welcome back.');
            navigate(from, { replace: true });
        } catch (error) {
            console.error(error);
            let msg = 'Failed to login';
            if (error.code === 'auth/wrong-password') msg = 'Incorrect password';
            if (error.code === 'auth/user-not-found') msg = 'No user found with this email';
            if (error.code === 'auth/invalid-credential') msg = 'Invalid credentials';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInGoogle();
            const user = result.user;

            // Prepare User Data for DB
            const userData = {
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                role: 'student', // Default role for Google Login
                phone: '', // Google does not imply phone
            };

            // Save user to backend (If exists, backend handles it gracefully)
            await axiosInstance.post('/user', userData);
            localStorage.setItem('userRole', 'student'); // Default role assumption for immediate UI

            toast.success('Logged in with Google successfully!');
            navigate(from, { replace: true });
        } catch (error) {
            console.error(error);
            toast.error('Google login failed. Please try again.');
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 gradient-bg">
            {/* Floating Orbs */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-20 right-20 w-64 h-64 bg-primary rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary rounded-full blur-3xl animate-float animation-delay-300" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
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
                                    Welcome Back
                                </h2>
                                <p className="text-base-content/60">
                                    Enter your credentials to access your account
                                </p>
                            </motion.div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <Input
                                floating
                                label="Email Address"
                                type="email"
                                placeholder="Enter your email"
                                leftIcon={<Mail size={20} />}
                                error={errors.email?.message}
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                            />

                            <div>
                                <Input
                                    label="Password"
                                    type="password"
                                    placeholder="Enter your password"
                                    leftIcon={<Lock size={20} />}
                                    error={errors.password?.message}
                                    {...register("password", { required: "Password is required" })}
                                />
                                <div className="flex justify-end mt-2">
                                    <a href="#" className="text-sm text-primary hover:underline">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="gradient"
                                size="lg"
                                fullWidth
                                loading={loading}
                                disabled={loading}
                                rightIcon={<LogIn size={18} />}
                                className="mt-6"
                            >
                                Sign In
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="divider text-sm text-base-content/50 my-6">OR</div>

                        {/* Google Login */}
                        <Button
                            variant="outline"
                            size="lg"
                            fullWidth
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            leftIcon={<Chrome size={20} className="text-primary" />}
                        >
                            Continue with Google
                        </Button>

                        {/* Register Link */}
                        <p className="text-center mt-6 text-sm text-base-content/70">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary font-semibold hover:underline">
                                Register Now
                            </Link>
                        </p>

                        {/* Info Alert */}
                        
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default Login;
