'use client';

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { environment } from './environment.prod';

export class ClientApiClient {
  private readonly client: AxiosInstance;
  private static instance: ClientApiClient;

  private constructor() {
    this.client = axios.create({
      baseURL: environment.apiUrl,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
  }

  public static getInstance(): ClientApiClient {
    if (!ClientApiClient.instance) {
      ClientApiClient.instance = new ClientApiClient();
    }
    return ClientApiClient.instance;
  }

  private getTokenFromCookie(): string | null {
    if (typeof document === 'undefined') return null;

    // Parse cookies from document.cookie
    const cookies = document.cookie.split(';').reduce((acc: Record<string, string>, cookie) => {
      const [key, value] = cookie.trim().split('=');
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    }, {});

    return cookies['auth-token'] || cookies['token'] || null;
  }


  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const token = this.getTokenFromCookie();

    const response = await this.client.delete<T>(url, {
      ...config,
      headers: {
        ...config?.headers,
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });
    return response.data;
  }
}

export const getClientApiClient = () => {
  return ClientApiClient.getInstance();
};
