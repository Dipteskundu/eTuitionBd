import { Outlet, Link } from 'react-router-dom';
import { FiHome, FiUser, FiSettings, FiLogOut, FiMenu } from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';
import useAuth from '../hooks/useAuth';

const DashboardLayout = () => {
    const { user, logout } = useAuth();

    const getMenuItems = () => {
        if (user?.role === 'student') {
            return [
                { path: '/dashboard/student', label: 'Dashboard', icon: <MdDashboard /> },
                { path: '/dashboard/student/my-tuitions', label: 'My Tuitions', icon: <FiHome /> },
                { path: '/dashboard/student/post-tuition', label: 'Post Tuition', icon: <FiUser /> },
                { path: '/dashboard/student/applied-tutors', label: 'Applied Tutors', icon: <FiUser /> },
                { path: '/dashboard/student/payment-history', label: 'Payment History', icon: <FiUser /> },
                { path: '/dashboard/student/profile', label: 'Profile', icon: <FiSettings /> },
            ];
        } else if (user?.role === 'tutor') {
            return [
                { path: '/dashboard/tutor', label: 'Dashboard', icon: <MdDashboard /> },
                { path: '/dashboard/tutor/my-applications', label: 'My Applications', icon: <FiHome /> },
                { path: '/dashboard/tutor/ongoing-tuitions', label: 'Ongoing Tuitions', icon: <FiUser /> },
                { path: '/dashboard/tutor/revenue-history', label: 'Revenue', icon: <FiUser /> },
                { path: '/dashboard/tutor/profile', label: 'Profile', icon: <FiSettings /> },
            ];
        } else if (user?.role === 'admin') {
            return [
                { path: '/dashboard/admin', label: 'Dashboard', icon: <MdDashboard /> },
                { path: '/dashboard/admin/user-management', label: 'Users', icon: <FiUser /> },
                { path: '/dashboard/admin/tuition-management', label: 'Tuitions', icon: <FiHome /> },
                { path: '/dashboard/admin/reports', label: 'Reports', icon: <FiSettings /> },
            ];
        }
        return [];
    };

    const SidebarContent = () => (
        <>
            <div className="p-6">
                <h2 className="text-2xl font-bold text-primary">eTuitionBd</h2>
                <p className="text-sm text-gray-500 capitalize">{user?.role} Dashboard</p>
            </div>
            <nav className="px-4">
                <ul className="space-y-2">
                    {getMenuItems().map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary hover:text-white transition-all"
                                onClick={() => {
                                    // Close drawer on mobile click
                                    const elem = document.activeElement;
                                    if (elem) elem.blur();
                                }}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                    <div className="divider my-2"></div>
                    <li>
                        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-all">
                            <FiHome className="text-xl" />
                            <span className="font-medium">Back to Home</span>
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-100 hover:text-red-600 transition-all"
                        >
                            <FiLogOut className="text-xl" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </>
    );

    return (
        <div className="drawer lg:drawer-open">
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col min-h-screen bg-base-200">
                {/* Navbar for Mobile */}
                <div className="w-full navbar bg-base-100 lg:hidden shadow-sm">
                    <div className="flex-none">
                        <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost">
                            <FiMenu className="text-2xl" />
                        </label>
                    </div>
                    <div className="flex-1 px-2 mx-2 font-bold text-xl text-primary">eTuitionBd</div>
                </div>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
            <div className="drawer-side z-50">
                <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
                <aside className="menu p-0 w-64 min-h-full bg-base-100 text-base-content shadow-xl">
                    <SidebarContent />
                </aside>
            </div>
        </div>
    );
};

export default DashboardLayout;
