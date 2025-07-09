import { cookies } from 'next/headers';

export const getAuthToken = async () => {
  const cookieStore = cookies();
  return (await cookieStore).get('auth-token')?.value;
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

// This function would be used on the client side
export const setAuthToken = (token: string) => {
  document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
};

export const removeAuthToken = () => {
  document.cookie = 'endpoint-token=; path=/; max-age=0';
};
