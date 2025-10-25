import React from 'react';

interface HamburgerButtonProps {
    onClick: () => void;
    isOpen: boolean;
}

const HamburgerButton: React.FC<HamburgerButtonProps> = ({ onClick, isOpen }) => {
    return (
        <button
            className="flex flex-col justify-center items-center w-8 h-8 p-1 bg-transparent border-none cursor-pointer transition-transform duration-300 hover:scale-110"
            onClick={onClick}
            aria-label="Toggle menu"
        >
            <span className={`bg-gray-900 dark:bg-gray-100 block transition-all duration-300 h-0.5 w-6 rounded-sm ${isOpen
                ? 'rotate-45 translate-y-1'
                : 'rotate-0'}`} />
            <span className={`bg-gray-900 dark:bg-gray-100 block transition-all duration-300 h-0.5 w-6 rounded-sm my-0.5 ${isOpen
                ? 'opacity-0'
                : 'opacity-100'}`} />
            <span className={`bg-gray-900 dark:bg-gray-100 block transition-all duration-300 h-0.5 w-6 rounded-sm ${isOpen
                ? '-rotate-45 -translate-y-1'
                : 'rotate-0'}`} />
        </button>
    );
};

export default HamburgerButton;
