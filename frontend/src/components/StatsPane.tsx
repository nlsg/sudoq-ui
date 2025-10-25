import React from 'react';

interface StatsPaneProps {
    board: string;
}

const StatsPane: React.FC<StatsPaneProps> = ({ board }) => {
    // Calculate digit frequencies
    const getDigitFrequencies = (boardStr: string): { [key: number]: number } => {
        const freq: { [key: number]: number } = {};
        for (let i = 1; i <= 9; i++) {
            freq[i] = 0;
        }

        for (const char of boardStr) {
            const digit = parseInt(char);
            if (digit >= 1 && digit <= 9) {
                freq[digit]++;
            }
        }

        return freq;
    };

    const frequencies = getDigitFrequencies(board);

    return (
        <div className="flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow-md p-3 md:p-4 min-w-[180px] md:min-w-[200px] border border-slate-200 dark:border-slate-700">
            <div className="mb-3 md:mb-4">
                <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100">Digit Stats</h3>
            </div>
            <div className="space-y-1 md:space-y-2">
                {Array.from({ length: 9 }, (_, i) => {
                    const digit = i + 1;
                    const count = frequencies[digit];
                    return (
                        <div key={digit} className="flex justify-between items-center text-sm md:text-base">
                            <span className="font-medium text-slate-700 dark:text-slate-300">Digit {digit}:</span>
                            <span className="text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded min-w-[2rem] text-center">{count}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StatsPane;
