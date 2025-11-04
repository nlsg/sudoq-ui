import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';
import { Code } from "lucide-react";
import ThemeToggle from './ThemeToggle';
import { useGameSettings } from '../contexts/GameSettingsContext';
import { useUser } from '../contexts/UserContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { settings, toggleAutoMarkCandidates } = useGameSettings();
    const { user } = useUser();

    const getAvatarColor = (username: string) => {
        let hash = 0;
        for (let i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash % 360);
        return `hsl(${hue}, 70%, 50%)`;
    };

    const getInitials = (username: string) => {
        return username.charAt(0).toUpperCase();
    };

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
                        Singleplayer
                    </Link>
                    <Link
                        to="/home"
                        onClick={onClose}
                        className="block px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-slate-100 rounded-md transition-colors duration-200 font-medium"
                    >
                        About
                    </Link>
                </nav>







                {/* User Account */}
                {user && (
                    <div className="p-4 border-t border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700">
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                                style={{ backgroundColor: getAvatarColor(user.username) }}
                            >
                                {getInitials(user.username)}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{user.username}</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">Guest User</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Settings */}
                <div className="p-6 border-t border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Theme</span>
                        <ThemeToggle />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Auto-mark candidates</span>
                        <button
                            onClick={toggleAutoMarkCandidates}
                            className={`relative inline-block w-11 h-6 rounded-full transition-colors duration-200 ${settings.autoMarkCandidates ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                            aria-label={`Toggle auto-mark candidates ${settings.autoMarkCandidates ? 'off' : 'on'}`}
                        >
                            <span
                                className={`absolute top-1 left-1 inline-block w-4 h-4 bg-white rounded-full transition-transform duration-200 ${settings.autoMarkCandidates ? 'translate-x-5' : 'translate-x-0'}`}
                            />
                        </button>
                    </div>
                    <a
                        href="https://github.com/nlsg/sudo-q"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">View source</span>
                            <FaGithub />
                        </div>
                    </a>
                </div >
            </div >
        </>
    );
};

export default Sidebar;
