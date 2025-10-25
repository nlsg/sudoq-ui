import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import HamburgerButton from './HamburgerButton';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 antialiased flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm fixed top-0 w-full z-40 px-4 flex items-center">
                <HamburgerButton onClick={toggleSidebar} isOpen={isSidebarOpen} />
            </header>

            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-25 z-30 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Main content */}
            <main className="flex-grow pt-20 pb-20 lg:ml-64">
                <div className="max-w-7xl mx-auto px-4">
                    <Outlet />
                </div>
            </main>

            {/* Footer */}
            <footer className="fixed bottom-0 w-full bg-white dark:bg-slate-800 py-4 px-4 z-40">
                <div className="max-w-7xl mx-auto text-center text-sm text-slate-500 dark:text-slate-400">
                    <p>&copy; 2024 SudoQ UI</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
