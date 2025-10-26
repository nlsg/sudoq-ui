import React from "react";

interface HintProps {
    strategy: string;
    explanation: string;
    action: string;
    primary_cell?: { row: number; col: number };
    affected_cells: Array<{ row: number; col: number }>;
    value?: number;
}

const HintToast: React.FC<{
    onDismissHint: () => void;
    onApplyHint: () => void;
    hint: HintProps;
}> = ({ onDismissHint, hint, onApplyHint }) => {
    const getStrategyDisplayName = (strategy: string) => {
        const names: { [key: string]: string } = {
            naked_single: "Naked Single",
            hidden_single: "Hidden Single",
            naked_pair: "Naked Pair",
            backtracking: "Backtracking",
            solution_hint: "Solution Hint",
        };
        return names[strategy] || strategy;
    };

    return (
        <div
            className="fixed top-6 right-6 z-50 max-w-sm shadow-lg 
                       animate-slide-up"
        >
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
                <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Hint: {getStrategyDisplayName(hint.strategy)}
                    </h4>
                    <button
                        onClick={onDismissHint}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm"
                        aria-label="Close hint"
                        title="Close hint"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                    {hint.explanation}
                </p>
                <div className="flex gap-2">
                    {hint.action === "place_value" && hint.primary_cell ? (
                        <button
                            onClick={onApplyHint}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded 
                                       hover:bg-blue-700 focus:outline-none focus:ring-2 
                                       focus:ring-blue-500 transition-colors"
                        >
                            Apply Hint
                        </button>
                    ) : (
                        <div className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-xs rounded">
                            Cannot Auto-Apply
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HintToast;
