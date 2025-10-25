import React from 'react';
import SudokuGrid from './SudokuGrid';

interface Board {
    id: number;
    board_state: string;
    status: string;
    player1_id: number;
    player2_id: number;
    current_player_id: number;
    winner_id?: number;
    created_at: string;
    updated_at: string;
}

interface WinningScreenProps {
    board: Board;
    onPlayAgain: () => void;
}

const WinningScreen: React.FC<WinningScreenProps> = ({ board, onPlayAgain }) => {
    return (
        <div className="text-center p-2 sm:p-4 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl mb-4">🎉 Congratulations! 🎉</h2>
            <p className="mb-6 text-slate-600 dark:text-slate-400">You completed the Sudoku puzzle!</p>
            <div className="mb-6 p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                <p>Game completed successfully!</p>
                {/* Could add more stats like hints used, etc. in future */}
            </div>
            <div className="mb-6">
                <h3 className="mb-4 text-lg font-semibold">Completed Puzzle:</h3>
                <SudokuGrid board={board.board_state} onMove={() => { }} />
            </div>
            <button onClick={onPlayAgain} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors font-medium text-base sm:text-lg">Play Again</button>
        </div>
    );
};

export default WinningScreen;
