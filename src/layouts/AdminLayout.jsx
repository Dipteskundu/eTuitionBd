import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, CreditCard, BarChart2, UserCheck, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const AdminLayout = () => {
    const { user, logOut } = useAuth();

    return (
        <div className="drawer lg:drawer-open">
            <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

            {/* Page Content */}
            <div className="drawer-content flex flex-col min-h-screen bg-base-100">
                {/* Topbar for Mobile */}
                <div className="w-full navbar bg-base-100 lg:hidden border-b border-base-200">
                    <div className="flex-none">
                        <label htmlFor="admin-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </label>
                    </div>
                    <div className="flex-1 px-2 mx-2 text-xl font-bold">Admin Panel</div>
                </div>

                <div className="p-8">
                    <Outlet />
                </div>
            </div>

            {/* Sidebar */}
            <div className="drawer-side z-20">
                <label htmlFor="admin-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content flex flex-col">
                    {/* User Info */}
                    <div className="mb-6 px-4">
                        <div className="avatar mb-2">
                            <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img src={user?.photoURL || "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"} alt="Admin" />
                            </div>
                        </div>
                        <h2 className="text-lg font-bold">{user?.displayName}</h2>
                        <span className="badge badge-primary badge-outline text-xs mt-1">Administrator</span>
                    </div>

                    {/* Navigation */}
                    <ul className="space-y-2 flex-1">
                        <li>
                            <NavLink to="/dashboard/admin" end className={({ isActive }) => isActive ? "active font-medium" : ""}>
                                <LayoutDashboard size={20} /> Overview
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/admin/users" className={({ isActive }) => isActive ? "active font-medium" : ""}>
                                <Users size={20} /> Manage Users
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/admin/tuitions" className={({ isActive }) => isActive ? "active font-medium" : ""}>
                                <BookOpen size={20} /> Manage Tuitions
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/admin/teacher-requests" className={({ isActive }) => isActive ? "active font-medium" : ""}>
                                <UserCheck size={20} /> Teacher Requests
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/admin/transactions" className={({ isActive }) => isActive ? "active font-medium" : ""}>
                                <CreditCard size={20} /> Transactions
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/admin/reports" className={({ isActive }) => isActive ? "active font-medium" : ""}>
                                <BarChart2 size={20} /> Reports & Analytics
                            </NavLink>
                        </li>
                    </ul>

                    {/* Bottom Actions */}
                    <div className="mt-auto border-t border-base-300 pt-4 space-y-2">
                        <Link to="/" className="btn btn-ghost w-full btn-sm justify-start gap-2">
                            <Home size={18} />
                            Return Home
                        </Link>
                        <button onClick={logOut} className="btn btn-neutral w-full btn-sm">Sign Out</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
