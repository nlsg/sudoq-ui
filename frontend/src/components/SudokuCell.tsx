import React from 'react';

interface SudokuCellProps {
    value: number | null;
    onChange: (value: number) => void;
    readonly: boolean;
    isActive: boolean;
    onClick: (event?: React.MouseEvent) => void;
    candidates: number[];
    hintHighlightType?: 'primary' | 'affected' | null;
}

const SudokuCell: React.FC<SudokuCellProps> = ({ value, onChange, readonly, isActive, onClick, candidates, hintHighlightType }) => {
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



    // Build className based on cell state and hint highlighting
    let className = 'flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 border cursor-pointer font-mono text-lg sm:text-xl relative transition-colors';

    if (hintHighlightType === 'primary') {
        className += ' bg-yellow-200 border-yellow-400 ring-2 ring-yellow-300';
    } else if (hintHighlightType === 'affected') {
        className += ' bg-blue-100 border-blue-300';
    } else {
        className += readonly
            ? ' bg-slate-50 font-bold text-slate-900 border-slate-300'
            : ' bg-white text-slate-900 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 border-slate-300';
    }

    return (
        <div
            className={className}
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
