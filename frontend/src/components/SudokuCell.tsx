import React from 'react';

interface SudokuCellProps {
    value: number | null;
    onChange: (value: number) => void;
    readonly: boolean;
    isActive: boolean;
    onClick: (event?: React.MouseEvent) => void;
}

const SudokuCell: React.FC<SudokuCellProps> = ({ value, onChange, readonly, isActive, onClick }) => {
    const handleDigitClick = (digit: number) => {
        onChange(digit);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (readonly) return;

        if (e.key >= '1' && e.key <= '9') {
            e.preventDefault();
            handleDigitClick(parseInt(e.key));
        } else if (e.key === '0' || e.key === 'Backspace' || e.key === 'Delete') {
            e.preventDefault();
            handleDigitClick(0);
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            // Could close the active cell if needed
        }
    };



    return (
        <div
            className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 border border-slate-300 cursor-pointer font-mono text-lg sm:text-xl ${readonly
                ? 'bg-slate-50 font-bold text-slate-900'
                : 'bg-white text-slate-900 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
                } transition-colors`}
            onClick={readonly ? undefined : onClick}
            onKeyDown={readonly ? undefined : handleKeyDown}
            tabIndex={readonly ? undefined : 0}
            title="Select a number"
        >
            {value || ''}
        </div>
    );
};

export default SudokuCell;
