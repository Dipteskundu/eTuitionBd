import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Users,
    CreditCard,
    Settings,
    LogOut,
    BookOpen,
    DollarSign,
    Briefcase,
    MessageCircle,
    Bookmark,
    Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useRole from '../../hooks/useRole';
import useAuth from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import logo from '../../assets/logo.png';
import ThemeToggle from '../ui/ThemeToggle';

const Sidebar = ({ isOpen, onClose }) => {
    const { role } = useRole();
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logOut();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const getMenuItems = () => {
        switch (role) {
            case ROLES.STUDENT:
                return [
                    { name: 'Overview', path: '/dashboard/student', icon: LayoutDashboard },
                    { name: 'Post Tuition', path: '/dashboard/student/post-tuition', icon: FileText },
                    { name: 'My Tuitions', path: '/dashboard/student/my-tuitions', icon: BookOpen },
                    { name: 'Applications', path: '/dashboard/student/applications', icon: Users },
                    { name: 'Payment History', path: '/dashboard/student/payments', icon: CreditCard },
                    { name: 'Profile', path: '/dashboard/student/profile', icon: Settings },
                    { name: 'Messages', path: '/dashboard/student/messages', icon: MessageCircle },
                    { name: 'Bookmarks', path: '/dashboard/student/bookmarks', icon: Bookmark },
                    { name: 'Calendar', path: '/dashboard/student/calendar', icon: Calendar },
                ];
            case ROLES.TUTOR:
                return [
                    { name: 'Overview', path: '/dashboard/tutor', icon: LayoutDashboard },
                    { name: 'Available Tuitions', path: '/dashboard/tutor/available-tuitions', icon: Briefcase },
                    { name: 'Applied Tuitions', path: '/dashboard/tutor/applied-tuitions', icon: FileText },
                    { name: 'Earnings', path: '/dashboard/tutor/earnings', icon: DollarSign },
                    { name: 'Profile', path: '/dashboard/tutor/profile', icon: Settings },
                    { name: 'Messages', path: '/dashboard/tutor/messages', icon: MessageCircle },
                    { name: 'Calendar', path: '/dashboard/tutor/calendar', icon: Calendar },
                ];
            case ROLES.ADMIN:
                return [
                    { name: 'Overview', path: '/dashboard/admin', icon: LayoutDashboard },
                    { name: 'Manage Users', path: '/dashboard/admin/users', icon: Users },
                    { name: 'Manage Tuitions', path: '/dashboard/admin/tuitions', icon: BookOpen },
                    { name: 'Transactions', path: '/dashboard/admin/transactions', icon: CreditCard },
                    { name: 'Reports', path: '/dashboard/admin/reports', icon: FileText },
                    { name: 'Messages', path: '/dashboard/admin/messages', icon: MessageCircle },
                ];
            default:
                return [];
        }
    };

    const menuItems = getMenuItems();

    // Sidebar Variants
    const sidebarVariants = {
        open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
        closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    };

    // Stagger for children
    const listVariants = {
        open: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
        closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
    };

    const itemVariants = {
        open: { opacity: 1, x: 0 },
        closed: { opacity: 0, x: -20 },
    };

    return (
        <AnimatePresence>
            {/* Mobile Overlay */}
            {isOpen && (
                <motion.div
                    key="mobile-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-20 bg-black/50 lg:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                key="sidebar-panel"
                className={`fixed top-0 left-0 z-30 h-full w-64 bg-base-100 border-r border-base-200 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="h-full flex flex-col">
                    {/* Logo Area */}
                    <div className="h-16 flex items-center px-6 border-b border-base-200">
                        <Link to="/" className="flex items-center gap-3">
                            <img
                                src={logo}
                                alt="eTuitionBd Logo"
                                className="w-8 h-8 object-contain"
                            />
                            <span className="text-xl font-bold text-primary">eTuitionBd</span>
                        </Link>
                    </div>

                    {/* Profile Section - First item after logo */}
                    <div className="px-4 py-3 border-b border-base-200">
                        <div className="flex items-center justify-between p-3 bg-base-100 border border-base-200 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="avatar">
                                    <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                        <img src={user?.photoURL || "https://i.ibb.co/MBtH413/unknown-user.jpg"} alt="User" />
                                    </div>
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="font-bold text-sm truncate">{user?.displayName || 'User'}</span>
                                    <span className="text-[10px] uppercase font-bold text-primary tracking-wider">{role}</span>
                                </div>
                            </div>
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 overflow-y-auto py-4">
                        <ul className="space-y-1 px-3">
                            {menuItems.map((item) => (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        onClick={() => onClose && onClose()}
                                        end={item.path === `/dashboard/${role}`}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                                ? 'bg-primary/10 text-primary border-l-4 border-primary font-bold'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-base-200 dark:hover:bg-base-300 hover:pl-5'
                                            }`
                                        }
                                    >
                                        <item.icon size={20} />
                                        <span className="font-medium">{item.name}</span>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Bottom Area */}
                    <div className="p-4 border-t border-base-200 space-y-2">
                        <Link
                            to="/"
                            className="flex w-full items-center gap-3 px-4 py-3 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                            <span className="font-medium">Return Home</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 px-4 py-3 text-error hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </AnimatePresence>
    );
};

export default Sidebar;
