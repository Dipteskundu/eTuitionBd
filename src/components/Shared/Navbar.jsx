import React, { useState, useContext, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, User, LogOut, Sun, Moon,
    Home, BookOpen, Users, Info, Phone,
    LayoutDashboard, Settings, ChevronRight, Zap
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole';
import { ThemeContext } from '../../context/ThemeContext';
import { ROLES } from '../../utils/constants';
import NotificationBell from '../ui/NotificationBell';
import ThemeToggle from '../ui/ThemeToggle';
import logo from '../../assets/logo.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, logOut } = useAuth();
    const { role } = useRole();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleLogout = async () => {
        try {
            await logOut();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const getDashboardLink = () => {
        switch (role) {
            case ROLES.STUDENT: return '/dashboard/student';
            case ROLES.TUTOR: return '/dashboard/tutor';
            case ROLES.ADMIN: return '/dashboard/admin';
            default: return '/';
        }
    };

    const navLinks = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Tuitions', path: '/tuitions', icon: BookOpen },
        { name: 'Tutors', path: '/tutors', icon: Users },
        { name: 'About', path: '/about', icon: Info },
        { name: 'Contact', path: '/contact', icon: Phone },
    ];

    // Animation Variants (Mobile)
    const menuVariants = {
        closed: {
            x: "100%",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40
            }
        },
        open: {
            x: "0%",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40,
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        closed: { x: 50, opacity: 0 },
        open: { x: 0, opacity: 1 }
    };

    return (
        <React.Fragment>
            {/* Main Navbar Container */}
            <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${scrolled ? 'pt-4' : 'pt-0'}`}>
                <nav
                    className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${scrolled
                        ? 'w-[92%] max-w-7xl rounded-2xl bg-white/80 dark:bg-slate-900/80 shadow-2xl shadow-black/5 ring-1 ring-black/5 dark:ring-white/10 backdrop-blur-2xl'
                        : 'w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-b border-white/10 dark:border-white/5'
                        }`}
                >
                    <div className="px-5 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16 md:h-20"> {/* Taller navbar on desktop */}

                            {/* Logo Section */}
                            <Link to="/" className="flex items-center gap-3 group relative z-50 flex-shrink-0">
                                <div className="relative w-10 h-10 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <img
                                        src={logo}
                                        alt="eTuitionBd Logo"
                                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 relative z-10"
                                    />
                                </div>
                                <span className="text-2xl font-heading font-bold text-slate-900 dark:text-white group-hover:text-primary transition-all duration-300">
                                    eTuitionBd
                                </span>
                            </Link>

                            {/* Desktop Menu - Centered & Modern */}
                            <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
                                <div className="flex items-center p-1.5 rounded-full bg-gray-100/50 dark:bg-slate-800/50 border border-white/50 dark:border-white/5">
                                    {navLinks.map((link) => (
                                        <NavLink
                                            key={link.name}
                                            to={link.path}
                                            className={({ isActive }) =>
                                                `relative px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 pointer-events-auto ${isActive
                                                    ? 'text-slate-900 dark:text-white'
                                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                                }`
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    {isActive && (
                                                        <motion.div
                                                            layoutId="navbar-active-pill"
                                                            className="absolute inset-0 bg-white dark:bg-slate-700 rounded-full shadow-sm"
                                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                        />
                                                    )}
                                                    <span className="relative z-10 flex items-center gap-2">
                                                        {link.name}
                                                    </span>
                                                </>
                                            )}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>

                            {/* Desktop Auth & Actions - Right Aligned */}
                            <div className="hidden md:flex items-center gap-3">
                                {user && (
                                    <div className="mr-1">
                                        <NotificationBell />
                                    </div>
                                )}
                                <ThemeToggle />

                                {user ? (
                                    <div className="dropdown dropdown-end">
                                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar ring-offset-2 ring-offset-current ring-2 ring-transparent hover:ring-primary/20 transition-all cursor-pointer">
                                            <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700">
                                                {user.photoURL ? (
                                                    <img src={user.photoURL} alt={user.displayName} />
                                                ) : (
                                                    <User className="w-6 h-6 m-2 text-slate-400" />
                                                )}
                                            </div>
                                        </label>
                                        <ul tabIndex={0} className="mt-4 z-[1] p-3 shadow-2xl menu menu-sm dropdown-content bg-white dark:bg-slate-900 rounded-3xl w-72 border border-slate-100 dark:border-slate-800 origin-top-right transform transition-all">
                                            <li className="p-2 mb-2 border-b border-slate-100 dark:border-slate-800 pointer-events-none">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-primary">
                                                        {user.displayName?.charAt(0) || "U"}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-slate-900 dark:text-white truncate">{user.displayName}</p>
                                                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <Link to={getDashboardLink()} className="py-3 px-4 font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl group">
                                                    <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                                                        <LayoutDashboard size={16} />
                                                    </div>
                                                    Dashboard
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/profile-settings" className="py-3 px-4 font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl group">
                                                    <div className="p-1.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg group-hover:bg-rose-100 dark:group-hover:bg-rose-900/50 transition-colors">
                                                        <Settings size={16} />
                                                    </div>
                                                    Settings
                                                </Link>
                                            </li>
                                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
                                            <li>
                                                <button onClick={handleLogout} className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 rounded-xl group">
                                                    <div className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg group-hover:bg-red-100 dark:group-hover:bg-red-900/30 group-hover:text-red-500 transition-colors">
                                                        <LogOut size={16} />
                                                    </div>
                                                    Log Out
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Link to="/login">
                                            <button className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
                                                Login
                                            </button>
                                        </Link>
                                        <Link to="/register">
                                            <button className="px-6 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95">
                                                Get Started
                                            </button>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Menu Button - Kept Exactly as Requested */}
                            <div className="md:hidden flex items-center gap-3 z-50">
                                {user && <NotificationBell />}
                                <ThemeToggle />

                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="relative w-10 h-10 rounded-full flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-soft"
                                >
                                    <AnimatePresence mode='wait'>
                                        {isOpen ? (
                                            <motion.div
                                                key="close"
                                                initial={{ rotate: -90, opacity: 0 }}
                                                animate={{ rotate: 0, opacity: 1 }}
                                                exit={{ rotate: 90, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <X size={20} />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="menu"
                                                initial={{ rotate: 90, opacity: 0 }}
                                                animate={{ rotate: 0, opacity: 1 }}
                                                exit={{ rotate: -90, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Menu size={20} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu Drawer - Preserved */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                        />

                        <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={menuVariants}
                            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[320px] bg-white dark:bg-slate-900 z-50 shadow-2xl md:hidden overflow-hidden border-l border-white/20"
                        >
                            {/* Decorative Gradients */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                            <div className="flex flex-col h-full relative z-10">
                                <div className="p-6 pt-24">
                                    {/* User Card */}
                                    {user ? (
                                        <motion.div variants={itemVariants} className="mb-8">
                                            <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="flex items-center gap-4 relative z-10">
                                                    <div className="relative">
                                                        <div className="w-14 h-14 rounded-full p-[2px] bg-primary">
                                                            <div className="w-full h-full rounded-full border-2 border-white dark:border-slate-800 overflow-hidden bg-white">
                                                                {user.photoURL ? (
                                                                    <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <User className="w-full h-full p-3 text-gray-400" />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-gray-900 dark:text-white truncate">{user.displayName}</h3>
                                                        <p className="text-xs font-medium text-primary uppercase tracking-wider">{role || 'Guest'}</p>
                                                    </div>
                                                </div>

                                                <div className="mt-5 grid grid-cols-2 gap-2 relative z-10">
                                                    <Link
                                                        to={getDashboardLink()}
                                                        onClick={() => setIsOpen(false)}
                                                        className="flex flex-col items-center justify-center p-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 hover:border-primary/30 transition-colors"
                                                    >
                                                        <LayoutDashboard size={18} className="text-primary mb-1" />
                                                        <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">Dashboard</span>
                                                    </Link>
                                                    <Link
                                                        to="/profile-settings"
                                                        onClick={() => setIsOpen(false)}
                                                        className="flex flex-col items-center justify-center p-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 hover:border-secondary/30 transition-colors"
                                                    >
                                                        <Settings size={18} className="text-secondary mb-1" />
                                                        <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">Profile</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div variants={itemVariants} className="mb-8 p-6 bg-gray-50 dark:bg-slate-800/50 rounded-3xl text-center">
                                            <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                                                <Zap className="text-primary fill-current" size={24} />
                                            </div>
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Welcome!</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Join us to start learning or teaching today.</p>
                                            <div className="flex gap-2">
                                                <Link to="/login" className="flex-1" onClick={() => setIsOpen(false)}>
                                                    <Button variant="ghost" size="sm" fullWidth className="bg-white dark:bg-slate-700 shadow-sm border border-gray-100 dark:border-gray-600">Login</Button>
                                                </Link>
                                                <Link to="/register" className="flex-1" onClick={() => setIsOpen(false)}>
                                                    <Button variant="primary" size="sm" fullWidth className="shadow-lg shadow-primary/20">Sign Up</Button>
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Navigation List */}
                                    <div className="space-y-1">
                                        {navLinks.map((link) => (
                                            <motion.div key={link.name} variants={itemVariants}>
                                                <NavLink
                                                    to={link.path}
                                                    onClick={() => setIsOpen(false)}
                                                    className={({ isActive }) =>
                                                        `group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${isActive
                                                            ? 'bg-primary/10 text-primary'
                                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                                                        }`
                                                    }
                                                >
                                                    {({ isActive }) => (
                                                        <>
                                                            <div className="flex items-center gap-4">
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-white dark:bg-slate-900 shadow-sm text-primary' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 group-hover:bg-white dark:group-hover:bg-slate-800'
                                                                    }`}>
                                                                    <link.icon size={20} />
                                                                </div>
                                                                <span className="font-semibold">{link.name}</span>
                                                            </div>
                                                            <ChevronRight size={18} className={`transition-transform duration-300 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                                                        </>
                                                    )}
                                                </NavLink>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer */}
                                {user && (
                                    <motion.div variants={itemVariants} className="mt-auto p-6 border-t border-gray-100 dark:border-gray-800">
                                        <button
                                            onClick={() => { handleLogout(); setIsOpen(false); }}
                                            className="w-full flex items-center justify-center gap-2 p-4 rounded-xl text-error font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                        >
                                            <LogOut size={20} />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </React.Fragment>
    );
};

export default Navbar;
