import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import SudokuCell from './SudokuCell';

interface SudokuGridProps {
    board: string; // 81-character string
    onMove: (row: number, col: number, value: number) => void;
    candidates?: number[][][];
    hint?: any;
}

const SudokuGrid: React.FC<SudokuGridProps> = ({ board, onMove, candidates, hint }) => {
    const [grid, setGrid] = useState<(number | null)[][]>([]);
    const [activeCell, setActiveCell] = useState<{ row: number, col: number } | null>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const wheelHideTimeoutRef = useRef<number | null>(null);
    const [gridPosition, setGridPosition] = useState({ x: 0, y: 0 });

    const handleCellClick = (row: number, col: number, event?: React.MouseEvent) => {
        // Hide wheel for filled cells or clicks on non-active empty cells
        if (grid[row][col] !== null || (activeCell && (activeCell.row !== row || activeCell.col !== col))) {
            setActiveCell(null);
            return;
        }
        // For the active empty cell, prevent propagation to avoid hiding the wheel
        event?.stopPropagation();
        setActiveCell({ row, col });
    };

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

        // Get grid position for digit button positioning
        if (gridRef.current) {
            const rect = gridRef.current.getBoundingClientRect();
            setGridPosition({ x: rect.left, y: rect.top });
        }
    }, [board]);

    // Update grid position when activeCell changes (for responsiveness)
    useEffect(() => {
        if (gridRef.current && activeCell) {
            const rect = gridRef.current.getBoundingClientRect();
            setGridPosition({ x: rect.left, y: rect.top });
        }
    }, [activeCell]);

    // Hide wheel when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setActiveCell(null);
        };

        if (activeCell) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [activeCell]);

    const handleCellChange = (row: number, col: number, value: number) => {
        if (grid[row][col] !== null) return; // only if empty originally
        onMove(row, col, value);
    };


    // Calculate positions for digits 1-9 arranged in a circle around the cell
    const digitPositions = [
        { number: 1, x: -26, y: -26 }, // northwest
        { number: 2, x: 0, y: -36 },   // north
        { number: 3, x: 26, y: -26 },  // northeast
        { number: 4, x: 36, y: 0 },    // east
        { number: 5, x: 26, y: 26 },   // southeast
        { number: 6, x: 0, y: 36 },    // south
        { number: 7, x: -26, y: 26 },  // southwest
        { number: 8, x: -36, y: 0 },   // west
        { number: 9, x: 0, y: 0 },     // center
    ];

    // Calculate cell dimensions dynamically
    const getCellDimensions = () => {
        const cellWidth = window.innerWidth >= 768 ? 56 : window.innerWidth >= 640 ? 48 : 40; // w-14, w-12, w-10
        const cellHeight = cellWidth;
        const borderWidth = 16; // 4 * 4px (Tailwind border-4)
        const totalCellGap = 4; // Spacing between cells

        return { cellWidth, cellHeight, borderWidth, totalCellGap };
    };

    const { cellWidth, cellHeight, borderWidth } = getCellDimensions();

    const calculateCellPosition = (row: number, col: number) => {
        const x = gridPosition.x + (col * cellWidth) + borderWidth;
        const y = gridPosition.y + (row * cellHeight) + borderWidth;
        return { x, y };
    };

    // Helper functions for hint highlighting
    const isPrimaryHintCell = (row: number, col: number) => {
        return hint?.primary_cell?.row === row && hint?.primary_cell?.col === col;
    };

    const isAffectedHintCell = (row: number, col: number) => {
        return hint?.affected_cells?.some((cell: any) => cell.row === row && cell.col === col);
    };

    const getHintHighlightType = (row: number, col: number) => {
        if (isPrimaryHintCell(row, col)) return 'primary';
        if (isAffectedHintCell(row, col)) return 'affected';
        return null;
    };

    return (
        <>
            <div ref={gridRef} className="relative inline-flex flex-col border-4 border-slate-800 bg-white shadow-2xl rounded-lg">
                {grid.map((row, r) => (
                    <div key={r} className={`flex ${r % 3 === 2 && r < 8 ? 'border-b-4 border-slate-800' : ''}`}>
                        {row.map((cell, c) => (
                            <div key={c} className={`relative ${c % 3 === 2 && c < 8 ? 'border-r-4 border-slate-800' : ''}`}>
                                <SudokuCell
                                    value={cell}
                                    onChange={(value) => handleCellChange(r, c, value)}
                                    readonly={cell !== null}
                                    isActive={activeCell?.row === r && activeCell?.col === c}
                                    onClick={(event) => handleCellClick(r, c, event)}
                                    candidates={candidates?.[r]?.[c] || []}
                                    hintHighlightType={getHintHighlightType(r, c)}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Digit buttons rendered via portal to avoid layout issues */}
            {activeCell && createPortal(
                <div
                    className="fixed z-[9999]"
                    style={{
                        left: `${calculateCellPosition(activeCell.row, activeCell.col).x + cellWidth / 2}px`,
                        top: `${calculateCellPosition(activeCell.row, activeCell.col).y + cellHeight / 2}px`,
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    onMouseEnter={() => {
                        // Clear any pending hide timeout when entering the wheel area
                        if (wheelHideTimeoutRef.current) {
                            clearTimeout(wheelHideTimeoutRef.current);
                            wheelHideTimeoutRef.current = null;
                        }
                    }}
                    onMouseLeave={() => {
                        // Delay hiding to allow mouse movement between buttons
                        wheelHideTimeoutRef.current = setTimeout(() => {
                            setActiveCell(null);
                        }, 150);
                    }}
                >
                    {digitPositions.map(({ number, x, y }) => (
                        <button
                            key={number}
                            className="absolute flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 border border-blue-300 text-slate-800 font-bold text-sm shadow-xl transition-all duration-200 hover:scale-110 z-[9999] pointer-events-auto transform -translate-x-1/2 -translate-y-1/2"
                            style={{ left: `${x}px`, top: `${y}px` }}
                            onClick={() => {
                                handleCellChange(activeCell.row, activeCell.col, number);
                                setActiveCell(null);
                            }}
                        >
                            {number}
                        </button>
                    ))}
                </div>,
                document.body
            )}
        </>
    );
};

export default SudokuGrid;
