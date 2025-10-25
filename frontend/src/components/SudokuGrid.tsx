import React, { useState, useEffect } from 'react';
import SudokuCell from './SudokuCell';
import './SudokuGrid.css';

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

    const handleCellChange = (row: number, col: number, value: number) => {
        if (grid[row][col] !== null) return; // only if empty originally
        onMove(row, col, value);
    };


    return (
        <div className="sudoku-grid-container">
            {grid.map((row, r) => (
                <div key={r} className={`sudoku-row ${r % 3 === 2 && r < 8 ? 'thick-border-bottom' : ''}`}>
                    {row.map((cell, c) => (
                        <div key={c} className={`sudoku-cell-container ${c % 3 === 2 && c < 8 ? 'thick-border-right' : ''}`}>
                            <SudokuCell
                                value={cell}
                                onChange={(value) => handleCellChange(r, c, value)}
                                readonly={cell !== null}
                            />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default SudokuGrid;
