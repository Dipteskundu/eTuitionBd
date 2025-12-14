import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';
import { Menu } from 'lucide-react';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-base-100 flex">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-64">
                {/* Topbar for Mobile */}
                <header className="h-16 flex items-center px-4 border-b border-base-200 lg:hidden bg-base-100 sticky top-0 z-20">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="btn btn-ghost btn-circle"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="ml-2 text-xl font-bold text-primary">eTuitionBd</span>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 p-4 md:p-8 bg-base-200/50 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
