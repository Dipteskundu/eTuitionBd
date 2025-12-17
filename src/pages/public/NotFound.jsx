import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertTriangle } from 'lucide-react';
import Button from '../../components/ui/Button';

const NotFound = () => {
    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] animate-float" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[100px] animate-float animation-delay-200" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-lg relative z-10 glass p-10 rounded-3xl"
            >
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center text-error animate-pulse">
                        <AlertTriangle size={48} />
                    </div>
                </div>

                <h1 className="text-6xl font-heading font-bold gradient-text mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-base-content mb-4">Page Not Found</h2>

                <p className="text-base-content/70 mb-8 text-lg">
                    Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <div className="flex justify-center gap-4">
                    <Link to="/">
                        <Button variant="gradient" size="lg">
                            <Home size={18} className="mr-2" /> Back to Home
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
