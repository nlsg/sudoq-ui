import React from 'react';

interface SudokuCellProps {
    value: number | null;
    onChange: (value: number) => void;
    readonly: boolean;
    isActive: boolean;
    onClick: (event?: React.MouseEvent) => void;
    candidates: number[];
}

const SudokuCell: React.FC<SudokuCellProps> = ({ value, onChange, readonly, isActive, onClick, candidates }) => {
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
            className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 border border-slate-300 cursor-pointer font-mono text-lg sm:text-xl relative ${readonly
                ? 'bg-slate-50 font-bold text-slate-900'
                : 'bg-white text-slate-900 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
                } transition-colors`}
            onClick={readonly ? undefined : onClick}
            onKeyDown={readonly ? undefined : handleKeyDown}
            tabIndex={readonly ? undefined : 0}
            title="Select a number"
        >
            {value ? value : null}
            {!value && candidates.length > 0 && (
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 text-[8px] sm:text-[10px] md:text-[12px] text-slate-600 pointer-events-none">
                    {Array.from({ length: 9 }, (_, i) => (
                        <div key={i} className="flex items-center justify-center">
                            {candidates.includes(i + 1) ? i + 1 : ''}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SudokuCell;
