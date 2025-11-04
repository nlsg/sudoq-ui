import React, { useState, useEffect, useCallback } from 'react';
import GameScreen from '../components/GameScreen';
import WinningScreen from '../components/WinningScreen';
import PuzzleHeader from '../components/PuzzleHeader';
import StatsPane from '../components/StatsPane';
import Hint from '../components/Hint';
import { boardApi } from '../api/service';
import { useUser } from '../contexts/UserContext';
import type { SudokuGame } from '../api/service'



const Singleplayer: React.FC = () => {
    const { user } = useUser();
    const [game, setGame] = useState<SudokuGame | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorCount, setErrorCount] = useState(0);
    const [statsVisible, setStatsVisible] = useState(false);
    const [currentHint, setCurrentHint] = useState<any>(null);
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');
    const [digitTypes, setDigitTypes] = useState<string[] | undefined>(undefined);


    useEffect(() => {
        createBoard()
    }, []);

    useEffect(() => setCurrentHint(null), [game])

    const createBoard = useCallback((selectedDifficulty?: 'easy' | 'medium' | 'hard' | 'expert') => {
        if (!user) return
        setLoading(true);
        boardApi.createSingleplayerGame({
            difficulty: selectedDifficulty ? selectedDifficulty : difficulty,
            digit_types: digitTypes,
            player1_id: user.id,
        }).then(response => {
            if (response.data) {
                setGame(response.data);
                if (response.data.digit_types) {
                    setDigitTypes(response.data.digit_types);
                }
                setErrorCount(0);
            } else throw response.error
        }).finally(() => setLoading(false))
    }, [digitTypes, difficulty])

    const handleMove = async (row: number, col: number, value: number) => {
        if (!game || !user) return;
        boardApi.makeMove(game.id, {
            player_id: user.id,
            row,
            col,
            value,
        }).then(response => {
            if (response.data) {
                setGame(response.data);
            } else {
                console.error('Move failed:', response.error);
                setErrorCount(prev => prev + 1);
            }
        })
    };

    const getHint = async () => {
        if (!game) return;
        try {
            const response = await boardApi.getHint(game.id);
            if (response.data) {
                setCurrentHint(response.data);
            } else {
                console.error('Hint failed:', response.error);
                alert('No hint available');
            }
        } catch (error) {
            console.error('Hint failed:', error);
        }
    };

    const applyHint = () => {
        if (currentHint && currentHint.action === 'place_value' && currentHint.value && currentHint.primary_cell) {
            handleMove(currentHint.primary_cell.row, currentHint.primary_cell.col, currentHint.value);
            setCurrentHint(null);
        }
    };
    const solveGame = async () => {
        if (!game) return;
        try {
            const response = await boardApi.solveGame(game.id);
            if (response.data && typeof response.data === 'object' && 'solution' in response.data) {
                setGame(prev => prev ? { ...prev, board_state: (response.data as any).solution, status: 'completed' } : null);
            } else {
                console.error('Solve failed:', response.error);
                alert('Could not solve the board');
            }
        } catch (error) {
            console.error('Solve failed:', error);
        }
    };

    const startNewGame = () => {
        createBoard();
        setErrorCount(0);
    };

    const currentGame = loading ? {
        board_state: "0".repeat(81),
        digit_types: null,
        mistakes_p1: 0,
        mistakes_p2: 0,
        valid_moves_p1: 1,
        valid_moves_p2: 1,
        id: 0,
        player1_id: 0,
        created_at: "",
        updated_at: "",
    } as SudokuGame : game;

    if (!game && !loading) return <button onClick={startNewGame}>Start New Game</button>;

    const gameCompleted = !currentGame?.board_state.includes("0");

    // Calculate remaining cells
    const remainingCells = currentGame ?
        81 - currentGame.board_state.split('').filter(char => char !== '0').length :
        81;

    return (
        <>
            {currentHint && (
                <Hint
                    onApplyHint={applyHint}
                    onDismissHint={() => setCurrentHint(null)}
                    hint={currentHint}
                />
            )}
            <div className="flex flex-row items-start justify-center w-full p-3 sm:p-6 max-w-full box-border text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">
                <div className="flex flex-col items-center w-full">
                    <PuzzleHeader
                        gameCompleted={gameCompleted}
                        errorCount={errorCount}
                        difficulty={difficulty}
                        remainingCells={remainingCells}
                        boardId={currentGame!.id}
                        digitTypes={digitTypes}
                        onDifficultyChange={setDifficulty}
                        onDigitTypesChange={(newDigitTypes) => {
                            setDigitTypes(newDigitTypes);
                            // createBoard()
                        }}
                        onStartNewGame={startNewGame}
                        onGetHint={getHint}
                        onSolveGame={solveGame}
                        onToggleStats={() => setStatsVisible(!statsVisible)}
                        statsVisible={statsVisible}
                    />

                    {currentGame && gameCompleted ? (
                        <WinningScreen game={currentGame} onPlayAgain={startNewGame} />
                    ) : currentGame ? (
                        <GameScreen
                            game={currentGame}
                            onMove={handleMove}
                            hint={currentHint}
                        />
                    ) : null}

                </div>
                {statsVisible && currentGame && (
                    <div className="mr-6">
                        <StatsPane board={currentGame.board_state} digitTypes={currentGame.digit_types} />
                    </div>
                )}

            </div>
        </>
    );
};

export default Singleplayer;
