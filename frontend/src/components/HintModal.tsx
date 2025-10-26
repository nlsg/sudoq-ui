import React from 'react';

interface HintModalProps {
    hint: {
        strategy: string;
        explanation: string;
        action: string;
        primary_cell?: { row: number; col: number };
        affected_cells: Array<{ row: number; col: number }>;
        value?: number;
    };
    onApply: () => void;
    onDismiss: () => void;
}

const HintModal: React.FC<HintModalProps> = ({ hint, onApply, onDismiss }) => {
    const getStrategyDisplayName = (strategy: string) => {
        const names: { [key: string]: string } = {
            'naked_single': 'Naked Single',
            'hidden_single': 'Hidden Single',
            'naked_pair': 'Naked Pair',
            'backtracking': 'Backtracking',
            'solution_hint': 'Solution Hint'
        };
        return names[strategy] || strategy;
    };

    const canApply = hint.action === 'place_value' && hint.primary_cell;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Hint: {getStrategyDisplayName(hint.strategy)}
                    </h3>
                    <button
                        onClick={onDismiss}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        aria-label="Close hint"
                        title="Close hint"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-slate-700 dark:text-slate-300 mb-3">
                        {hint.explanation}
                    </p>
                </div>

                <div className="flex gap-3">
                    {canApply ? (
                        <button
                            onClick={onApply}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                            Apply Hint
                        </button>
                    ) : (
                        <div className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-md">
                            Cannot Auto-Apply
                        </div>
                    )}
                    <button
                        onClick={onDismiss}
                        className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HintModal;
