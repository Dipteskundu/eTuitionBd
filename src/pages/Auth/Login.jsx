import React, { useState } from 'react';
import useTitle from '../../hooks/useTitle';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Chrome, AlertCircle, Shield, GraduationCap, Users } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import axiosInstance from '../../utils/axiosInstance';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Form from '../../components/ui/Form';

const Login = () => {
    useTitle('Login');
    const { register, handleSubmit, setValue, formState: { errors, dirtyFields } } = useForm({
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

            const userData = {
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                role: 'student',
                phone: '',
            };

            try {
                await axiosInstance.post('/user', userData);
            } catch (backendError) {
                console.warn('Failed to sync Google user to backend:', backendError);
            }

            toast.success('Logged in with Google successfully!');
            navigate(from, { replace: true });
        } catch (error) {
            if (error.code === 'auth/popup-closed-by-user') {
                return;
            }
            console.error(error);

            let msg = 'Google login failed. Please try again.';
            if (error.code === 'auth/unauthorized-domain') {
                msg = 'Google login blocked: add http://localhost:5173 to Firebase Authorized domains.';
            }
            if (error.code === 'auth/operation-not-allowed') {
                msg = 'Google sign-in is disabled in Firebase console. Enable it under Sign-in methods.';
            }
            if (error.code === 'auth/cancelled-popup-request') {
                msg = 'Google login was cancelled. Please try again.';
            }

            toast.error(msg);
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
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="Enter your email"
                                leftIcon={<Mail size={20} />}
                                error={errors.email?.message}
                                success={!errors.email && dirtyFields.email}
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
                                    success={!errors.password && dirtyFields.password}
                                    {...register("password", { required: "Password is required" })}
                                />
                                <div className="flex justify-end mt-2">
                                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                                        Forgot password?
                                    </Link>
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

                            {/* Demo Logins */}
                            <div className="mt-8">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-base-content/10"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-base-100 px-2 text-base-content/50">Quick Testing Access</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setValue("email", "diptes@gmsil.com");
                                            setValue("password", "1dipte$kundU");
                                            toast.success("Admin credentials applied!");
                                        }}
                                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 group"
                                    >
                                        <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300 mb-2">
                                            <Shield size={18} />
                                        </div>
                                        <span className="text-xs font-semibold text-base-content/70 group-hover:text-primary">Admin</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setValue("email", "lyzah@mailinator.com");
                                            setValue("password", "Pa$$w0rd!");
                                            toast.success("Student credentials applied!");
                                        }}
                                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-secondary/20 bg-secondary/5 hover:bg-secondary/10 hover:border-secondary/40 transition-all duration-300 group"
                                    >
                                        <div className="p-2 rounded-full bg-secondary/10 text-secondary group-hover:scale-110 transition-transform duration-300 mb-2">
                                            <GraduationCap size={18} />
                                        </div>
                                        <span className="text-xs font-semibold text-base-content/70 group-hover:text-secondary">Student</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setValue("email", "sumon@v.com");
                                            setValue("password", "sumon@v.com");
                                            toast.success("Tutor credentials applied!");
                                        }}
                                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-accent/20 bg-accent/5 hover:bg-accent/10 hover:border-accent/40 transition-all duration-300 group"
                                    >
                                        <div className="p-2 rounded-full bg-accent/10 text-accent group-hover:scale-110 transition-transform duration-300 mb-2">
                                            <Users size={18} />
                                        </div>
                                        <span className="text-xs font-semibold text-base-content/70 group-hover:text-accent">Tutor</span>
                                    </button>
                                </div>
                            </div>
                        </Form>

                        {/* Divider */}
                        <div className="divider text-sm text-base-content/50 my-6">OR</div>

                        {/* Google Login */}
                        <Button
                            variant="outline"
                            size="lg"
                            fullWidth
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            leftIcon={<Chrome size={24} className="text-primary" />}
                            className="whitespace-nowrap"
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
