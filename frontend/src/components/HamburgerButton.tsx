import React from 'react';
import './HamburgerButton.css';

interface HamburgerButtonProps {
    onClick: () => void;
    isOpen: boolean;
}

const HamburgerButton: React.FC<HamburgerButtonProps> = ({ onClick, isOpen }) => {
    return (
        <button className={`hamburger-button ${isOpen ? 'open' : ''}`} onClick={onClick}>
            <span></span>
            <span></span>
            <span></span>
        </button>
    );
};

export default HamburgerButton;
