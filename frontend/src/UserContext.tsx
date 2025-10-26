import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
    id: number;
    username: string;
    email?: string;
    avatar_url?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface UserContextType {
    user: User | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const guestUserId = localStorage.getItem('guestUserId');
        if (guestUserId) {
            fetchUser(parseInt(guestUserId));
        } else {
            createGuestUser();
        }
    }, []);

    const fetchUser = async (userId: number) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/v1/users/${userId}`);
            if (response.ok) {
                const userData: User = await response.json();
                setUser(userData);
            } else {
                createGuestUser();
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            createGuestUser();
        } finally {
            setIsLoading(false);
        }
    };

    const createGuestUser = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/v1/users/guest', {
                method: 'POST',
            });
            if (response.ok) {
                const userData: User = await response.json();
                setUser(userData);
                localStorage.setItem('guestUserId', userData.id.toString());
            } else {
                console.error('Failed to create guest user');
            }
        } catch (error) {
            console.error('Error creating guest user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <UserContext.Provider value={{ user, isLoading, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
