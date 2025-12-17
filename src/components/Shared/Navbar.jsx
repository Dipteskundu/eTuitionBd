import React, { useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, ChevronDown, Sun, Moon } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole';
import { ThemeContext } from '../../context/ThemeContext';
import { ROLES } from '../../utils/constants';
import Button from '../ui/Button';
import logo from '../../assets/logo.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logOut } = useAuth();
    const { role } = useRole();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

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
        { name: 'Home', path: '/' },
        { name: 'Tuitions', path: '/tuitions' },
        { name: 'Tutors', path: '/tutors' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className="sticky top-0 z-40 glass border-b border-base-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src={logo}
                            alt="eTuitionBd Logo"
                            className="w-10 h-10 object-contain transition-transform group-hover:scale-110"
                        />
                        <span className="text-2xl font-heading font-bold gradient-text">
                            eTuitionBd
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <div className="flex items-center gap-6">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `text-sm font-medium transition-colors duration-200 hover:text-primary ${isActive ? 'text-primary' : 'text-gray-600 dark:text-gray-300'
                                        }`
                                    }
                                >
                                    {link.name}

                                </NavLink>
                            ))}
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex items-center gap-4">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="btn btn-ghost btn-circle btn-sm"
                                aria-label="Toggle Theme"
                            >
                                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                            </button>

                            {user ? (
                                <div className="dropdown dropdown-end">
                                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar border border-base-300">
                                        <div className="w-10 rounded-full">
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt={user.displayName} />
                                            ) : (
                                                <User className="w-6 h-6 m-2 text-gray-500" />
                                            )}
                                        </div>
                                    </label>
                                    <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-200">
                                        <li className="px-4 py-2 hover:bg-transparent">
                                            <p className="font-semibold truncate text-gray-800 dark:text-gray-200">{user.displayName || user.email}</p>
                                            <p className="text-xs text-gray-500 block mt-1">
                                                User: <span className="uppercase font-bold text-primary">{role || 'User'}</span>
                                            </p>
                                        </li>
                                        <div className="divider my-0"></div>
                                        <li><Link to={getDashboardLink()}>Dashboard</Link></li>
                                        <li><Link to="/profile-settings">Profile Settings</Link></li>
                                        <li>
                                            <button onClick={handleLogout} className="text-error">
                                                <LogOut size={16} /> Logout
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            ) : (
                                <>
                                    <Link to="/login">
                                        <Button variant="ghost" size="sm">Login</Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button variant="primary" size="sm">Register</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="btn btn-ghost btn-circle"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu AnimatePresence */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden overflow-hidden border-b border-base-200 bg-base-100/95 backdrop-blur-xl"
                    >
                        <div className="px-4 py-6 space-y-3">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `block px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive
                                            ? 'bg-primary/10 text-primary font-bold'
                                            : 'text-base-content/70 hover:bg-base-200 hover:text-primary hover:pl-6'
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}

                            <div className="divider my-4"></div>

                            {user ? (
                                <div className="space-y-4 bg-base-200/50 p-4 rounded-2xl border border-base-200">
                                    <div className="flex items-center gap-4">
                                        <div className="avatar ring-2 ring-primary ring-offset-2 rounded-full">
                                            <div className="w-12 rounded-full">
                                                {user.photoURL ? (
                                                    <img src={user.photoURL} alt={user.displayName} />
                                                ) : (
                                                    <User className="w-6 h-6 m-3" />
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">{user.displayName}</p>
                                            <div className="badge badge-primary badge-sm uppercase mt-1">{role || 'User'}</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            to={getDashboardLink()}
                                            onClick={() => setIsOpen(false)}
                                            className="btn btn-primary btn-sm w-full"
                                        >
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsOpen(false);
                                            }}
                                            className="btn btn-outline btn-error btn-sm w-full"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <Link to="/login" onClick={() => setIsOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-center">Login</Button>
                                    </Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)}>
                                        <Button variant="primary" className="w-full justify-center">Register</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
