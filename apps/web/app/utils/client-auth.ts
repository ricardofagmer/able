'use client';

// Client-side endpoint utilities

export const getAuthTokenClient = (): string | null => {
  // Parse cookies from document.cookie
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});

  return cookies['endpoint-token'] || null;
};

export const isAuthenticatedClient = (): boolean => {
  return !!getAuthTokenClient();
};

export const setAuthToken = (token: string): void => {
  document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
};

export const removeAuthToken = (): void => {
  document.cookie = 'endpoint-token=; path=/; max-age=0';
};
