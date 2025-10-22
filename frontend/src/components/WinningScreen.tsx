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
        <div className="finished-screen">
            <h2>🎉 Congratulations! 🎉</h2>
            <p>You completed the Sudoku puzzle!</p>
            <div className="game-stats">
                <p>Game completed successfully!</p>
                {/* Could add more stats like hints used, etc. in future */}
            </div>
            <div className="solved-grid-wrapper">
                <h3>Completed Puzzle:</h3>
                <SudokuGrid board={board.board_state} onMove={() => { }} />
            </div>
            <button onClick={onPlayAgain} className="new-game-btn">Play Again</button>
        </div>
    );
};

export default WinningScreen;
