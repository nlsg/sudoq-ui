import React from 'react';

interface PuzzleHeaderProps {
    gameCompleted: boolean;
    errorCount: number;
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    remainingCells?: number;
    onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard' | 'expert') => void;
    onStartNewGame: () => void;
    onGetHint: () => void;
    onSolveGame: () => void;
}

const GameClock: React.FC<{ gameCompleted?: boolean }> = ({ gameCompleted = false }) => {
    const [time, setTime] = React.useState(0);
    const [isRunning, setIsRunning] = React.useState(false);

    React.useEffect(() => {
        let interval: number;
        if (isRunning && !gameCompleted) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, gameCompleted]);

    React.useEffect(() => {
        setIsRunning(true);
        return () => setIsRunning(false);
    }, []);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    return <div className="game-clock">Time: {formatTime(time)}</div>;
};

const PuzzleHeader: React.FC<PuzzleHeaderProps> = ({ gameCompleted, errorCount, difficulty, remainingCells, onDifficultyChange, onStartNewGame, onGetHint, onSolveGame }) => {
    return (
        <div className="puzzle-header">
            <div className="header-bottom">
                <GameClock gameCompleted={gameCompleted} />
                <div className="error-counter">Errors: {errorCount}</div>
            </div>
            <div className="header-bottom">
                {remainingCells !== undefined && <div className="remaining-cells">Remaining Cells: {remainingCells}</div>}
            </div>
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
        </div>
    );
};

export { GameClock };
export default PuzzleHeader;
