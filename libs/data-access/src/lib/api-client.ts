import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { environment } from './environment.prod';

export class ServerApiClient {
  private readonly client: AxiosInstance;
  private static instance: ServerApiClient;

  private constructor() {
    this.client = axios.create({
      baseURL: environment.apiUrl,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
  }

  public static getInstance(): ServerApiClient {
    if (!ServerApiClient.instance) {
      ServerApiClient.instance = new ServerApiClient();
    }
    return ServerApiClient.instance;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    let token: string | undefined;
    
    if (typeof window === 'undefined') {
      // Server-side: use next/headers
      const { cookies } = await import('next/headers');
      const cookieStore = cookies();
      token = (await cookieStore).get('token')?.value;
    }
    
    const response = await this.client.get<T>(url, {
      ...config,
      headers: {
        ...config?.headers,
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    let token: string | undefined;
    
    if (typeof window === 'undefined') {
      // Server-side: use next/headers
      const { cookies } = await import('next/headers');
      const cookieStore = cookies();
      token = (await cookieStore).get('token')?.value;
    }
    
    const response = await this.client.post<T>(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    let token: string | undefined;
    
    if (typeof window === 'undefined') {
      // Server-side: use next/headers
      const { cookies } = await import('next/headers');
      const cookieStore = cookies();
      token = (await cookieStore).get('token')?.value;
    }
    
    const response = await this.client.put<T>(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    let token: string | undefined;
    
    if (typeof window === 'undefined') {
      // Server-side: use next/headers
      const { cookies } = await import('next/headers');
      const cookieStore = cookies();
      token = (await cookieStore).get('token')?.value;
    }
    
    const response = await this.client.patch<T>(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    let token: string | undefined;
    
    if (typeof window === 'undefined') {
      // Server-side: use next/headers
      const { cookies } = await import('next/headers');
      const cookieStore = cookies();
      token = (await cookieStore).get('token')?.value;
    }
    
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

export const serverApiClient = ServerApiClient.getInstance();

