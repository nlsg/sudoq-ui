import React, { useState, useEffect } from 'react';
import SudokuGrid from '../components/SudokuGrid';

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

const Boards: React.FC = () => {
    const [board, setBoard] = useState<Board | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // For demo, assume user_id=1, load or create singleplayer
        loadOrCreateBoard(1);
    }, []);

    const loadOrCreateBoard = async (userId: number) => {
        setLoading(true);
        try {
            // Try to get existing boards
            const res = await fetch(`/api/v1/boards?player_id=${userId}&limit=1`);
            const boards = await res.json();
            if (boards.length > 0) {
                setBoard(boards[0]);
            } else {
                // Create new
                const newRes = await fetch(`/api/v1/boards/singleplayer?user_id=${userId}`, {
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

    const startNewGame = () => {
        loadOrCreateBoard(1);
    };

    if (loading) return <div>Loading...</div>;
    if (!board) return <button onClick={startNewGame}>Start New Game</button>;

    return (
        <div>
            <h1>Sudoku Singleplayer</h1>
            <p>Status: {board.status}</p>
            {board.status === 'completed' && <p>Congratulations! You won!</p>}
            <button onClick={startNewGame}>New Game</button>
            <SudokuGrid board={board.board_state} onMove={handleMove} />
        </div>
    );
};

export default Boards;
