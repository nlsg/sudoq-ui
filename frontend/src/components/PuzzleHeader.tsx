import React from 'react';
import HamburgerButton from './HamburgerButton';
import ThemeToggle from './ThemeToggle';

interface PuzzleHeaderProps {
    gameCompleted: boolean;
    errorCount: number;
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    remainingCells: number;
    boardId: number;
    onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard' | 'expert') => void;
    onStartNewGame: () => void;
    onGetHint: () => void;
    onSolveGame: () => void;
    onToggleStats: () => void;
    statsVisible: boolean;
}

const GameClock: React.FC<{ gameCompleted?: boolean; boardId?: number }> = ({ gameCompleted = false, boardId }) => {
    const [time, setTime] = React.useState(0);
    const [isRunning, setIsRunning] = React.useState(false);

    React.useEffect(() => {
        // Reset time when board changes (new game)
        setTime(0);
    }, [boardId]);

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

    return <div className="game-clock text-slate-900 dark:text-slate-100">Time: {formatTime(time)}</div>;
};
const PuzzleHeader: React.FC<PuzzleHeaderProps> = ({ gameCompleted, errorCount, difficulty, remainingCells, boardId, onDifficultyChange, onStartNewGame, onGetHint, onSolveGame, onToggleStats, statsVisible }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <div className="flex flex-col w-[360px] sm:w-[432px] md:w-[504px] bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6 border border-slate-200 dark:border-slate-700">
            {/* Top row with stats */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-6">
                    <GameClock gameCompleted={gameCompleted} boardId={boardId} />
                    <div className="text-sm text-red-600 font-semibold">
                        Errors: {errorCount}
                    </div>
                    {remainingCells !== undefined && (
                        <div className="text-sm text-blue-600 font-semibold">
                            Empty: {remainingCells}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onToggleStats}
                        title={statsVisible ? "Hide Stats" : "Show Stats"}
                        className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={statsVisible ? "text-blue-600" : "text-slate-600 dark:text-slate-400"}>
                            <path d="M3 3v18h18M7.5 12h9 l-2 3M6 9h1.5M13.5 6v3M9 12v2.5M12 6v2.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                    <HamburgerButton
                        onClick={() => setIsExpanded(!isExpanded)}
                        isOpen={isExpanded}
                    />
                </div>
            </div>

            {/* Bottom row with controls */}
            <div className="flex flex-wrap gap-3 items-center">
                {onGetHint && (
                    <button
                        onClick={onGetHint}
                        title="Hint"
                        className="px-4 py-1.5 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors font-medium text-sm"
                    >
                        <div className="flex items-center gap-1">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <span className="hidden sm:inline">Hint</span>
                        </div>
                    </button>
                )}
                <button
                    onClick={onSolveGame}
                    className="px-4 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors font-medium text-sm"
                >
                    Solve
                </button>
            </div>

            {/* Expanded settings panel */}
            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Theme:</span>
                            <ThemeToggle />
                        </div>
                        <div className="flex items-center gap-2">
                            <label htmlFor="difficulty-select" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Difficulty:
                            </label>
                            <select
                                id="difficulty-select"
                                value={difficulty}
                                onChange={(e) => onDifficultyChange(e.target.value as 'easy' | 'medium' | 'hard' | 'expert')}
                                className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                                <option value="expert">Expert</option>
                            </select>
                        </div>
                        <button
                            onClick={onStartNewGame}
                            className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-medium text-sm"
                        >
                            New Game
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export { GameClock };
export default PuzzleHeader;
