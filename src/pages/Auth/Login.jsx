import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Chrome, AlertCircle } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { signIn, signInGoogle } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signIn(email, password);
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
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-base-200/30">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-200"
            >
                <div className="card-body p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Welcome Back</h2>
                        <p className="text-gray-500 mt-2">Enter your credentials to access your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            icon={<Mail size={20} />}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <div className="form-control w-full">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                icon={<Lock size={20} />}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label className="label">
                                <span className="label-text-alt"></span>
                                <a href="#" className="label-text-alt link link-hover text-primary">Forgot password?</a>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full mt-2"
                            loading={loading}
                            disabled={loading}
                        >
                            Sign In <LogIn size={18} className="ml-2" />
                        </Button>
                    </form>

                    <div className="divider text-sm text-gray-500">OR</div>

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                    >
                        <Chrome size={20} className="mr-2 text-primary" /> Continue with Google
                    </Button>

                    <p className="text-center mt-6 text-sm text-gray-600">
                        Don't have an account?
                        <Link to="/register" className="text-primary font-bold hover:underline ml-1">
                            Register Now
                        </Link>
                    </p>

                    <div className="alert alert-info bg-blue-50 text-blue-800 text-xs mt-6 flex items-start gap-2 border-blue-100">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span>
                            <strong>Note:</strong> These are example credentials.
                            <br />
                            Please <strong>Register</strong> first to create these accounts if they don't exist.
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
