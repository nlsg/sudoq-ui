import React, { useState, useEffect } from 'react';
import './SudokuGrid.css'; // We'll create this for styling

interface SudokuGridProps {
    board: string; // 81-character string
    onMove: (row: number, col: number, value: number) => void;
}

const SudokuGrid: React.FC<SudokuGridProps> = ({ board, onMove }) => {
    const [grid, setGrid] = useState<(number | null)[][]>([]);

    useEffect(() => {
        // Parse board string into 9x9 grid
        const newGrid: (number | null)[][] = [];
        for (let i = 0; i < 9; i++) {
            const row: (number | null)[] = [];
            for (let j = 0; j < 9; j++) {
                const char = board[i * 9 + j];
                row.push(char === '0' ? null : parseInt(char));
            }
            newGrid.push(row);
        }
        setGrid(newGrid);
    }, [board]);

    const handleChange = (row: number, col: number, value: string) => {
        if (!grid[row][col]) { // only if empty originally?
            const num = value === '' ? 0 : parseInt(value);
            if (num >= 0 && num <= 9) {
                onMove(row, col, num);
            }
        }
    };

    return (
        <div className="sudoku-grid">
            {grid.map((row, r) => (
                <div key={r} className="sudoku-row">
                    {row.map((cell, c) => (
                        <input
                            key={c}
                            type="number"
                            min="1"
                            max="9"
                            value={cell === null ? '' : cell}
                            disabled={cell !== null} // disable pre-filled
                            className="sudoku-cell"
                            onChange={(e) => handleChange(r, c, e.target.value)}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default SudokuGrid;
