import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import './Sidebar.css';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    return (
        <>
            {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>SudoQ</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/" onClick={onClose}>Home</Link>
                    <Link to="/singleplayer" onClick={onClose}>Singleplayer</Link>
                </nav>
                <div className="sidebar-footer">
                    <ThemeToggle />
                </div>
            </div>
        </>
    );
};

export default Sidebar;
