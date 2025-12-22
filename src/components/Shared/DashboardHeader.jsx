import React from 'react';
import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole';
import ThemeToggle from '../ui/ThemeToggle';
import NotificationBell from '../ui/NotificationBell';

const DashboardHeader = () => {
    const { user } = useAuth();
    const { role } = useRole();

    return (
        <div className="flex items-center justify-between bg-base-100/50 backdrop-blur-md border border-base-200 rounded-2xl p-4 mb-6 sticky top-4 z-10 shadow-sm">
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-primary/20 p-0.5">
                        <img
                            src={user?.photoURL || "https://i.ibb.co/MBtH413/unknown-user.jpg"}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                    <span className="absolute bottom-1 right-0 w-3.5 h-3.5 bg-success rounded-full border-2 border-base-100"></span>
                </div>

                {/* Info */}
                <div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-base-content/60">Welcome back,</span>
                        <h2 className="font-bold text-xl leading-tight gradient-text">
                            {user?.displayName || 'User'}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <NotificationBell />
            </div>
        </div>
    );
};

export default DashboardHeader;
