import React from 'react';
import './SudokuCell.css';

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

    return (
        <select
            className={`sudoku-cell ${readonly ? 'readonly' : ''}`}
            value={value === null ? '' : value}
            onChange={handleChange}
            disabled={readonly}
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
