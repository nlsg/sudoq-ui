import React, { useEffect, useState } from 'react';
import SudokuGrid from './SudokuGrid';
import { useGameSettings } from '../contexts/GameSettingsContext';
import { boardApi, type SudokuGame } from '../api/service';

interface GameScreenProps {
    game: SudokuGame;
    onMove: (row: number, col: number, value: number) => void;
    hint?: any;
}

const GameScreen: React.FC<GameScreenProps> = ({
    game,
    onMove,
    hint,
}) => {
    const { settings } = useGameSettings();
    const [candidates, setCandidates] = useState<number[][][]>([]);

    useEffect(() => {
        if (settings.autoMarkCandidates && game.id > 0) {
            boardApi.getCandidates(game.id)
                .then(response => {
                    if (response.data) {
                        setCandidates(response.data.candidates);
                    } else {
                        setCandidates([]);
                    }
                })
                .catch(() => {
                    setCandidates([]);
                });
        } else {
            setCandidates([]);
        }
    }, [game.board_state, settings.autoMarkCandidates, game.id]);

    return (
        <div className="w-full flex justify-center overflow-x-auto gap-4 md:flex-row flex-col items-center">
            <SudokuGrid board={game.board_state} onMove={onMove} candidates={candidates} hint={hint} digitTypes={game.digit_types} />
        </div>
    );
};

export default GameScreen;
