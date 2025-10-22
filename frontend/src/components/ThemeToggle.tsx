import React from 'react';
import { useTheme } from '../ThemeContext';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.5rem',
                padding: '0.5rem',
                borderRadius: '4px',
            }}
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? '🌙' : '☀️'}
        </button>
    );
};

export default ThemeToggle;
