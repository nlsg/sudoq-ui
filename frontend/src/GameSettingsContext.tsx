import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface GameSettings {
    autoMarkCandidates: boolean;
}

interface GameSettingsContextType {
    settings: GameSettings;
    toggleAutoMarkCandidates: () => void;
}

const GameSettingsContext = createContext<GameSettingsContextType | undefined>(undefined);

interface GameSettingsProviderProps {
    children: ReactNode;
}

export const GameSettingsProvider: React.FC<GameSettingsProviderProps> = ({ children }) => {
    const [settings, setSettings] = useState<GameSettings>({
        autoMarkCandidates: false,
    });

    useEffect(() => {
        const saved = localStorage.getItem('sudoku-autoinitial-candidates');
        if (saved) {
            setSettings(prev => ({ ...prev, autoMarkCandidates: JSON.parse(saved) }));
        }
    }, []);

    const toggleAutoMarkCandidates = () => {
        setSettings(prev => {
            const newVal = !prev.autoMarkCandidates;
            localStorage.setItem('sudoku-autoinitial-candidates', JSON.stringify(newVal));
            return { ...prev, autoMarkCandidates: newVal };
        });
    };

    return (
        <GameSettingsContext.Provider value={{ settings, toggleAutoMarkCandidates }}>
            {children}
        </GameSettingsContext.Provider>
    );
};

export const useGameSettings = (): GameSettingsContextType => {
    const context = useContext(GameSettingsContext);
    if (!context) {
        throw new Error('useGameSettings must be used within a GameSettingsProvider');
    }
    return context;
};
