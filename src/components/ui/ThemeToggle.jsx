import React, { useContext } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-base-200 transition-colors relative"
            aria-label="Toggle Theme"
        >
            <motion.div
                initial={false}
                animate={{
                    rotate: theme === 'dark' ? 180 : 0,
                    scale: theme === 'dark' ? 0 : 1
                }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <Sun size={20} className="text-warning" />
            </motion.div>

            <motion.div
                initial={false}
                animate={{
                    rotate: theme === 'dark' ? 0 : -180,
                    scale: theme === 'dark' ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center"
            >
                <Moon size={20} className="text-primary" />
            </motion.div>

            {/* Invisible Spacer to maintain button size */}
            <div className="opacity-0">
                <Sun size={20} />
            </div>
        </button>
    );
};

export default ThemeToggle;
