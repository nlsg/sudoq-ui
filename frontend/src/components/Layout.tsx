import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import HamburgerButton from './HamburgerButton';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{
                padding: '1rem 2rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <HamburgerButton onClick={toggleSidebar} isOpen={isSidebarOpen} />
                    <nav className="desktop-nav">
                        <Link to="/" style={{ marginLeft: '1rem', marginRight: '1rem', textDecoration: 'none', color: 'inherit' }}>Home</Link>
                        <Link to="/boards" style={{ textDecoration: 'none', color: 'inherit' }}>Boards</Link>
                    </nav>
                </div>
                <ThemeToggle />
            </header>
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <main style={{ flex: 1, padding: '2rem' }}>
                <Outlet />
            </main>
            <footer style={{
                padding: '1rem',
                textAlign: 'center',
                borderTop: '1px solid var(--border-color)',
                fontSize: '0.8rem'
            }}>
                <p>SudoQ UI</p>
            </footer>
        </div>
    );
};

export default Layout;
