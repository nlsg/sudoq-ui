import type { paths, components } from './types';

// Base API configuration
// const API_BASE_URL = 'http://localhost:8000';
const API_BASE_URL = '';

// Generic API response types
type ApiResponse<T> = {
    data: T;
    error?: string;
};

// HTTP client wrapper
class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return { data };
    }

    async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
        const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
        return this.request<T>(url);
    }

    async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
        });
    }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

// User API functions
export const userApi = {
    // GET /api/v1/users/
    readUsers: async (params?: { skip?: number; limit?: number }) => {
        return apiClient.get<components['schemas']['User'][]>('/api/v1/users/', params);
    },

    // POST /api/v1/users/
    createUser: async (userData: components['schemas']['UserCreate']) => {
        return apiClient.post<components['schemas']['User']>('/api/v1/users/', userData);
    },

    // GET /api/v1/users/{user_id}
    readUser: async (userId: number) => {
        return apiClient.get<components['schemas']['User']>(`/api/v1/users/${userId}`);
    },

    // PUT /api/v1/users/{user_id}
    updateUser: async (userId: number, userData: components['schemas']['UserUpdate']) => {
        return apiClient.put<components['schemas']['User']>(`/api/v1/users/${userId}`, userData);
    },

    // DELETE /api/v1/users/{user_id}
    deleteUser: async (userId: number) => {
        return apiClient.delete<unknown>(`/api/v1/users/${userId}`);
    },

    // POST /api/v1/users/guest
    createGuest: async () => {
        return apiClient.post<components['schemas']['User']>('/api/v1/users/guest');
    },
};

// Board/Game API functions
export const boardApi = {
    // GET /api/v1/boards/
    readGames: async (params?: { player_id?: number; skip?: number; limit?: number }) => {
        return apiClient.get<components['schemas']['SudokuGame'][]>('/api/v1/boards/', params);
    },

    // POST /api/v1/boards/
    createGame: async (gameData: components['schemas']['SudokuGameCreate']) => {
        return apiClient.post<components['schemas']['SudokuGame']>('/api/v1/boards/', gameData);
    },

    // GET /api/v1/boards/{game_id}
    readGame: async (gameId: number) => {
        return apiClient.get<components['schemas']['SudokuGame']>(`/api/v1/boards/${gameId}`);
    },

    // DELETE /api/v1/boards/{game_id}
    deleteGame: async (gameId: number) => {
        return apiClient.delete<unknown>(`/api/v1/boards/${gameId}`);
    },

    // POST /api/v1/boards/singleplayer
    createSingleplayerGame: async (gameData: components['schemas']['SudokuGameCreate']) => {
        return apiClient.post<components['schemas']['SudokuGame']>(`/api/v1/boards/singleplayer`,
            gameData
        );
    },

    // PUT /api/v1/boards/{game_id}/move
    makeMove: async (gameId: number, moveData: components['schemas']['GameMove']) => {
        return apiClient.put<components['schemas']['SudokuGame']>(`/api/v1/boards/${gameId}/move`, moveData);
    },

    // GET /api/v1/boards/{game_id}/hint
    getHint: async (gameId: number) => {
        return apiClient.get<components['schemas']['Hint']>(`/api/v1/boards/${gameId}/hint`);
    },

    // GET /api/v1/boards/{game_id}/solve
    solveGame: async (gameId: number) => {
        return apiClient.get<unknown>(`/api/v1/boards/${gameId}/solve`);
    },

    // GET /api/v1/boards/{game_id}/candidates
    getCandidates: async (gameId: number) => {
        return apiClient.get<components["schemas"]["CandidatesMap"]>(`/api/v1/boards/${gameId}/candidates`);
    },
};

// Export types for convenience
export type { components, paths };
export type User = components['schemas']['User'];
export type SudokuGame = components['schemas']['SudokuGame'];
export type GameMove = components['schemas']['GameMove'];
export type Hint = components['schemas']['Hint'];
