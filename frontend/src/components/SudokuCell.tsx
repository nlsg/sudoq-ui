import React from 'react';

interface SudokuCellProps {
    value: number | null;
    onChange: (value: number) => void;
    readonly: boolean;
}

const SudokuCell: React.FC<SudokuCellProps> = ({ value, onChange, readonly }) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value === '' ? 0 : parseInt(e.target.value);
        onChange(newValue);
    };

    return readonly ? (
        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 border border-slate-300 bg-slate-50 font-mono text-lg sm:text-xl font-bold text-slate-900">
            {value || ''}
        </div>
    ) : (
        <select
            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 border border-slate-300 cursor-pointer bg-white font-mono text-lg sm:text-xl text-slate-900 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            value={value === null ? '' : value}
            onChange={handleChange}
            title="Select a number"
        >
            <option value=""></option>
            {Array.from({ length: 9 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                    {i + 1}
                </option>
            ))}
        </select>
    );
};

export default SudokuCell;
