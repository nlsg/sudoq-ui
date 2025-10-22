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

interface GameScreenProps {
    board: Board;
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard' | 'expert') => void;
    onStartNewGame: () => void;
    onGetHint: () => void;
    onSolveGame: () => void;
    onMove: (row: number, col: number, value: number) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
    board,
    difficulty,
    onDifficultyChange,
    onStartNewGame,
    onGetHint,
    onSolveGame,
    onMove,
}) => {
    return (
        <>
            <p>Status: {board.status}</p>
            <div className="game-controls">
                <div className="difficulty-selector">
                    <label htmlFor="difficulty-select" title="Select game difficulty"></label>
                    <select
                        id="difficulty-select"
                        value={difficulty}
                        onChange={(e) => onDifficultyChange(e.target.value as 'easy' | 'medium' | 'hard' | 'expert')}
                        title="Select game difficulty"
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                        <option value="expert">Expert</option>
                    </select>
                </div>
                <button onClick={onStartNewGame}>New Game</button>
                <button onClick={onGetHint}>Hint</button>
                <button onClick={onSolveGame}>Solve</button>
            </div>
            <div className="sudoku-grid-wrapper">
                <SudokuGrid board={board.board_state} onMove={onMove} />
            </div>
        </>
    );
};

export default GameScreen;
