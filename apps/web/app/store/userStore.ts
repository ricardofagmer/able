'use client';

import { create } from 'zustand';
import { AccountRole } from '@able/common';
import { useEffect } from 'react';

interface User {
    userId: number;
    userEmail: string;
    userRole: string;
    userName: string;
}

interface UserState {
    account: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    logout: () => void;
    setTokens: (accessToken: string, refreshToken: string, user: { id: number, email: string, role: AccountRole }) => void;
    isAuthenticated: () => boolean;
    initializeFromStorage: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
    accessToken: null,
    refreshToken: null,
    account: null,

    initializeFromStorage: () => {
        if (typeof window !== 'undefined') {
            set({
                accessToken: localStorage.getItem('ableAccessToken') || null,
                refreshToken: localStorage.getItem('ableRefreshToken') || null,
                account: localStorage.getItem('ableAccount') || null,
            });
        }
    },

    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('ableAccessToken');
            localStorage.removeItem('ableRefreshToken');
            localStorage.removeItem('ableAccount');

            // Remove the endpoint-token cookie
            document.cookie = 'endpoint-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        }
        set({ account: null, accessToken: null, refreshToken: null });
    },

    setTokens: (accessToken: string, refreshToken: string, user: { id: number, email: string, role: string }) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('ableAccount', JSON.stringify(user));
            localStorage.setItem('ableAccessToken', accessToken);
            localStorage.setItem('ableRefreshToken', refreshToken);

            document.cookie = `auth-token=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
        }
        set({
            accessToken,
            refreshToken,
            account: JSON.stringify(user)
        });
    },

    isAuthenticated: () => !!get().accessToken,
}));

export function useInitUserStore() {
    const initializeFromStorage = useUserStore(state => state.initializeFromStorage);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            initializeFromStorage();
        }
    }, []); // Empty dependency array means this runs once after initial render

    return null;
}
