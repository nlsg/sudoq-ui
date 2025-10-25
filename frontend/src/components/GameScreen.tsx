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
    onMove: (row: number, col: number, value: number) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
    board,
    onMove,
}) => {
    return (
        <div className="w-full flex justify-center overflow-x-auto">
            <SudokuGrid board={board.board_state} onMove={onMove} />
        </div>
    );
};

export default GameScreen;
