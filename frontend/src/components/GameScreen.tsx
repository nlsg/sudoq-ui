import React from 'react';
import SudokuGrid from './SudokuGrid';
import StatsPane from './StatsPane';

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
    statsVisible: boolean;
}

const GameScreen: React.FC<GameScreenProps> = ({
    board,
    onMove,
    statsVisible,
}) => {
    return (
        <div className="w-full flex justify-center overflow-x-auto gap-4 md:flex-row flex-col items-center">
            <SudokuGrid board={board.board_state} onMove={onMove} />
            {statsVisible && (
                <StatsPane
                    board={board.board_state}
                />
            )}
        </div>
    );
};

export default GameScreen;
