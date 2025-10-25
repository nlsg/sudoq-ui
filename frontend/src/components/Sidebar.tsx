import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    return (
        <>
            {/* Mobile backdrop overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar panel */}
            <div className={`fixed top-0 left-0 h-full w-64 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 transform transition-transform duration-300 ease-in-out z-50 shadow-xl border-r border-slate-300 dark:border-slate-700 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                } flex flex-col lg:translate-x-0`}>

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">SudoQ</h2>
                    <button
                        className="text-3xl bg-transparent border-none cursor-pointer text-slate-900 dark:text-slate-300 hover:text-slate-600 dark:hover:text-slate-400 transition-colors duration-200 lg:hidden"
                        onClick={onClose}
                        aria-label="Close sidebar"
                    >
                        &times;
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-6 space-y-2 bg-white dark:bg-slate-700">
                    <Link
                        to="/"
                        onClick={onClose}
                        className="block px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-slate-100 rounded-md transition-colors duration-200 font-medium"
                    >
                        Home
                    </Link>
                    <Link
                        to="/singleplayer"
                        onClick={onClose}
                        className="block px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-slate-100 rounded-md transition-colors duration-200 font-medium"
                    >
                        Singleplayer
                    </Link>
                </nav>

                {/* Theme toggle */}
                <div className="p-6 border-t border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Theme</span>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
