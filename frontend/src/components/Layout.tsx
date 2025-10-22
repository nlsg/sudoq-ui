import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Layout: React.FC = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{
                padding: '1rem 2rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <nav>
                    <Link to="/" style={{ marginRight: '1rem', textDecoration: 'none', color: 'inherit' }}>Home</Link>
                    <Link to="/boards" style={{ textDecoration: 'none', color: 'inherit' }}>Boards</Link>
                </nav>
                <ThemeToggle />
            </header>
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
