import React, { useState, useEffect } from 'react';
import GameScreen from '../components/GameScreen';
import WinningScreen from '../components/WinningScreen';
import PuzzleHeader from '../components/PuzzleHeader';
import StatsPane from '../components/StatsPane';
import Hint from '../components/Hint';

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
const Singleplayer: React.FC = () => {
    const [board, setBoard] = useState<Board | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorCount, setErrorCount] = useState(0);
    const [statsVisible, setStatsVisible] = useState(false);
    const [currentHint, setCurrentHint] = useState<any>(null);

    useEffect(() => {
        // For demo, assume user_id=1, load or create singleplayer
        createBoard(1);
    }, []);

    useEffect(() => setCurrentHint(null), [board])

    const createBoard = async (userId: number, selectedDifficulty?: 'easy' | 'medium' | 'hard' | 'expert') => {
        setLoading(true);
        try {
            const newRes = await fetch(`/api/v1/boards/singleplayer?user_id=${userId}&difficulty=${selectedDifficulty || 'medium'}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const newBoard = await newRes.json();
            setBoard(newBoard);
        } catch (error) {
            console.error('Failed to load board:', error);
        }
        setLoading(false);
    };

    const handleMove = async (row: number, col: number, value: number) => {
        if (!board) return;
        try {
            const res = await fetch(`/api/v1/boards/${board.id}/move`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ player_id: 1, row, col, value }),
            });
            if (res.ok) {
                const updatedBoard = await res.json();
                setBoard(updatedBoard);
            } else {
                setErrorCount(prev => prev + 1);
            }
        } catch (error) {
            console.error('Move failed:', error);
        }
    };

    const getHint = async () => {
        if (!board) return;
        try {
            const res = await fetch(`/api/v1/boards/${board.id}/hint`);
            if (res.ok) {
                const hint = await res.json();
                setCurrentHint(hint);
            } else {
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

    const dismissHint = () => {
        setCurrentHint(null);
    };

    const solveGame = async () => {
        if (!board) return;
        try {
            const res = await fetch(`/api/v1/boards/${board.id}/solve`);
            if (res.ok) {
                const data = await res.json();
                setBoard(prev => prev ? { ...prev, board_state: data.solution, status: 'completed' } : null);
            } else {
                alert('Could not solve the board');
            }
        } catch (error) {
            console.error('Solve failed:', error);
        }
    };

    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');

    const startNewGame = () => {
        createBoard(1, difficulty);
        setErrorCount(0);
    };

    const createLoadingBoard = (): Board => ({
        id: 0,
        board_state: '0'.repeat(81), // empty grid
        status: 'loading',
        player1_id: 1,
        player2_id: 1,
        current_player_id: 1,
        created_at: '',
        updated_at: ''
    });

    const currentBoard = loading ? createLoadingBoard() : board;

    if (!board && !loading) return <button onClick={startNewGame}>Start New Game</button>;

    const gameCompleted = currentBoard ? currentBoard.status === 'completed' : false;

    // Calculate remaining cells
    const remainingCells = currentBoard ?
        81 - currentBoard.board_state.split('').filter(char => char !== '0').length :
        81;

    return (
        <>                   {/* Hint display */}
            {currentHint && (
                <Hint
                    onApplyHint={applyHint}
                    onDismissHint={dismissHint}
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
                        boardId={currentBoard!.id}
                        onDifficultyChange={setDifficulty}
                        onStartNewGame={startNewGame}
                        onGetHint={getHint}
                        onSolveGame={solveGame}
                        onToggleStats={() => setStatsVisible(!statsVisible)}
                        statsVisible={statsVisible}
                    />

                    {currentBoard && gameCompleted ? (
                        <WinningScreen board={currentBoard} onPlayAgain={startNewGame} />
                    ) : currentBoard ? (
                        <GameScreen
                            board={currentBoard}
                            onMove={handleMove}
                            hint={currentHint}
                        />
                    ) : null}

                </div>
                {statsVisible && currentBoard && (
                    <div className="mr-6">
                        <StatsPane board={currentBoard.board_state} />
                    </div>
                )}

            </div>
        </>
    );
};

export default Singleplayer;
