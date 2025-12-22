import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebase';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import useTitle from '../../hooks/useTitle';
import useToast from '../../hooks/useToast';

const ForgotPassword = () => {
    useTitle('Forgot Password');
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, data.email);
            setEmailSent(true);
            toast.success('Password reset email sent! Check your inbox.');
        } catch (error) {
            console.error(error);
            let message = 'Failed to send reset email';
            if (error.code === 'auth/user-not-found') {
                message = 'No account found with this email';
            } else if (error.code === 'auth/invalid-email') {
                message = 'Invalid email address';
            } else if (error.code === 'auth/too-many-requests') {
                message = 'Too many attempts. Please try again later';
            }
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 gradient-bg">
            {/* Background Elements */}
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
                        {!emailSent ? (
                            <>
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <motion.div
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Mail className="text-primary" size={32} />
                                        </div>
                                        <h2 className="font-heading text-3xl font-bold gradient-text mb-2">
                                            Forgot Password?
                                        </h2>
                                        <p className="text-base-content/60 text-sm">
                                            No worries! Enter your email and we'll send you reset instructions.
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

                                    <Button
                                        type="submit"
                                        variant="gradient"
                                        size="lg"
                                        fullWidth
                                        loading={loading}
                                    >
                                        Send Reset Link
                                    </Button>
                                </form>

                                {/* Back to Login */}
                                <div className="mt-6">
                                    <Link
                                        to="/login"
                                        className="flex items-center justify-center gap-2 text-sm text-base-content/70 hover:text-primary transition-colors"
                                    >
                                        <ArrowLeft size={16} />
                                        Back to Login
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Success State */}
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-center py-4"
                                >
                                    <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="text-success" size={40} />
                                    </div>
                                    <h3 className="font-heading text-2xl font-bold text-base-content mb-3">
                                        Check Your Email
                                    </h3>
                                    <p className="text-base-content/70 mb-2">
                                        We've sent a password reset link to:
                                    </p>
                                    <p className="text-primary font-semibold mb-6">
                                        {getValues('email')}
                                    </p>
                                    <div className="bg-base-200/50 rounded-lg p-4 mb-6">
                                        <p className="text-sm text-base-content/60">
                                            <strong>Didn't receive the email?</strong>
                                            <br />
                                            Check your spam folder or{' '}
                                            <button
                                                onClick={() => setEmailSent(false)}
                                                className="text-primary hover:underline font-medium"
                                            >
                                                try again
                                            </button>
                                        </p>
                                    </div>
                                    <Link to="/login">
                                        <Button variant="outline" fullWidth>
                                            Back to Login
                                        </Button>
                                    </Link>
                                </motion.div>
                            </>
                        )}
                    </div>
                </Card>

                {/* Help Text */}
                <div className="text-center mt-6">
                    <p className="text-sm text-base-content/50">
                        Need help?{' '}
                        <Link to="/contact" className="text-primary hover:underline">
                            Contact Support
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
