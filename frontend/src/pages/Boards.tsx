import React, { useState, useEffect } from 'react';
import GameScreen from '../components/GameScreen';
import WinningScreen from '../components/WinningScreen';
import './Boards.css';

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

const GameClock: React.FC<{ gameCompleted?: boolean }> = ({ gameCompleted = false }) => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval: number;
        if (isRunning && !gameCompleted) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, gameCompleted]);

    useEffect(() => {
        setIsRunning(true); // Start clock when component mounts
        return () => setIsRunning(false);
    }, []);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    return <div className="game-clock">Time: {formatTime(time)}</div>;
};

const Boards: React.FC = () => {
    const [board, setBoard] = useState<Board | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // For demo, assume user_id=1, load or create singleplayer
        loadOrCreateBoard(1);
    }, []);

    const loadOrCreateBoard = async (userId: number, selectedDifficulty?: 'easy' | 'medium' | 'hard' | 'expert') => {
        setLoading(true);
        try {
            // Try to get existing boards
            const res = await fetch(`/api/v1/boards?player_id=${userId}&limit=1`);
            const boards = await res.json();
            if (boards.length > 0) {
                setBoard(boards[0]);
            } else {
                // Create new
                const newRes = await fetch(`/api/v1/boards/singleplayer?user_id=${userId}&difficulty=${selectedDifficulty || 'medium'}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                });
                const newBoard = await newRes.json();
                setBoard(newBoard);
            }
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
                body: JSON.stringify({ row, col, value }),
            });
            if (res.ok) {
                const updatedBoard = await res.json();
                setBoard(updatedBoard);
            } else {
                alert('Invalid move');
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
                alert(`Hint: Row ${hint.row + 1}, Col ${hint.col + 1}, Value ${hint.value}`);
            } else {
                alert('No hint available');
            }
        } catch (error) {
            console.error('Hint failed:', error);
        }
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
        loadOrCreateBoard(1, difficulty);
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

    return (
        <div className="sudoku-game-container">
            <h1>Sudoku Singleplayer</h1>
            {loading && <div className="loading-indicator">Loading game...</div>}
            <GameClock gameCompleted={gameCompleted} />
            {currentBoard && gameCompleted ? (
                <WinningScreen board={currentBoard} onPlayAgain={startNewGame} />
            ) : currentBoard ? (
                <GameScreen
                    board={currentBoard}
                    difficulty={difficulty}
                    onDifficultyChange={setDifficulty}
                    onStartNewGame={startNewGame}
                    onGetHint={getHint}
                    onSolveGame={solveGame}
                    onMove={handleMove}
                />
            ) : null}
        </div>
    );
};

export default Boards;
