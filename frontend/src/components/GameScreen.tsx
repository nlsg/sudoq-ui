import React, { useEffect, useState } from 'react';
import SudokuGrid from './SudokuGrid';
import { useGameSettings } from '../contexts/GameSettingsContext';

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
    hint?: any;
}

const GameScreen: React.FC<GameScreenProps> = ({
    board,
    onMove,
    hint,
}) => {
    const { settings } = useGameSettings();
    const [candidates, setCandidates] = useState<number[][][]>([]);

    useEffect(() => {
        if (settings.autoMarkCandidates && board.id > 0) {
            fetch(`/api/v1/boards/${board.id}/candidates`)
                .then(res => res.json())
                .then(data => setCandidates(data.candidates))
                .catch(err => console.error('Failed to fetch candidates:', err));
        } else {
            setCandidates([]);
        }
    }, [board.board_state, settings.autoMarkCandidates, board.id]);

    return (
        <div className="w-full flex justify-center overflow-x-auto gap-4 md:flex-row flex-col items-center">
            <SudokuGrid board={board.board_state} onMove={onMove} candidates={candidates} hint={hint} />
        </div>
    );
};

export default GameScreen;
