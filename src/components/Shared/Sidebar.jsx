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
    Briefcase
} from 'lucide-react';
import useRole from '../../hooks/useRole';
import useAuth from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';

const Sidebar = ({ isOpen, onClose }) => {
    const { role } = useRole();
    const { logOut } = useAuth();
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
                ];
            case ROLES.TUTOR:
                return [
                    { name: 'Overview', path: '/dashboard/tutor', icon: LayoutDashboard },
                    { name: 'Available Tuitions', path: '/dashboard/tutor/available-tuitions', icon: Briefcase },
                    { name: 'Applied Tuitions', path: '/dashboard/tutor/applied-tuitions', icon: FileText },
                    { name: 'Earnings', path: '/dashboard/tutor/earnings', icon: DollarSign },
                    { name: 'Profile', path: '/dashboard/tutor/profile', icon: Settings },
                ];
            case ROLES.ADMIN:
                return [
                    { name: 'Overview', path: '/dashboard/admin', icon: LayoutDashboard },
                    { name: 'Manage Users', path: '/dashboard/admin/users', icon: Users },
                    { name: 'Manage Tuitions', path: '/dashboard/admin/tuitions', icon: BookOpen },
                    { name: 'Transactions', path: '/dashboard/admin/transactions', icon: CreditCard },
                    { name: 'Reports', path: '/dashboard/admin/reports', icon: FileText },
                ];
            default:
                return [];
        }
    };

    const menuItems = getMenuItems();

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-30 h-full w-64 bg-base-100 border-r border-base-200 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="h-full flex flex-col">
                    {/* Logo Area */}
                    <div className="h-16 flex items-center px-6 border-b border-base-200">
                        <Link to="/" className="text-xl font-bold text-primary">
                            eTuitionBd
                        </Link>
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
                    <div className="p-4 border-t border-base-200">
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
        </>
    );
};

export default Sidebar;
