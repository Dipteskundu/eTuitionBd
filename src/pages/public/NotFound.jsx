import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertTriangle } from 'lucide-react';
import Button from '../../components/ui/Button';

const NotFound = () => {
    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-base-200/50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-lg"
            >
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center text-error">
                        <AlertTriangle size={48} />
                    </div>
                </div>

                <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Page Not Found</h2>

                <p className="text-gray-500 mb-8">
                    Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <div className="flex justify-center gap-4">
                    <Link to="/">
                        <Button variant="primary">
                            <Home size={18} className="mr-2" /> Back to Home
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
