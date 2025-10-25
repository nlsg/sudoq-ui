import React, { useState, useEffect } from 'react';
import SudokuCell from './SudokuCell';

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
        <div className="inline-flex flex-col border-4 border-slate-800 bg-white shadow-2xl rounded-lg overflow-hidden">
            {grid.map((row, r) => (
                <div key={r} className={`flex ${r % 3 === 2 && r < 8 ? 'border-b-4 border-slate-800' : ''}`}>
                    {row.map((cell, c) => (
                        <div key={c} className={`${c % 3 === 2 && c < 8 ? 'border-r-4 border-slate-800' : ''}`}>
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
