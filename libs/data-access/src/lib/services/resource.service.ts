import { serverApiClient } from '../api-client';
import { QueryOptions } from '../types';

export interface ResourceService<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>> {
  getAll(options?: QueryOptions): Promise<T[]>;
  getById(id: string | number): Promise<T>;
  create(data: CreateDTO): Promise<T>;
  update(id: string | number, data: UpdateDTO): Promise<T>;
  delete(id: string | number): Promise<void>;
  customEndpoint<R = any>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    data?: any,
    options?: QueryOptions
  ): Promise<R>;
}

export class ServerResourceService<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>> implements ResourceService<T, CreateDTO, UpdateDTO> {
  constructor(private readonly baseEndpoint: string) {}

  private buildQueryParams(options?: QueryOptions): string {
    if (!options) return '';

    const params = new URLSearchParams();
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.sort) params.append('sort', options.sort);
    if (options.order) params.append('order', options.order);

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        params.append(key, String(value));
      });
    }

    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  }

  async getAll(options?: QueryOptions): Promise<T[]> {
    const queryParams = this.buildQueryParams(options);
    return serverApiClient.get<T[]>(`${this.baseEndpoint}/getAll${queryParams}`);
  }

  async getById(id: string | number): Promise<T> {
    return serverApiClient.get<T>(`${this.baseEndpoint}/getById/${id}`);
  }

  async create(data: CreateDTO): Promise<T> {
    return serverApiClient.post<T>(`${this.baseEndpoint}/create`, data);
  }

  async update(id: string | number, data: UpdateDTO): Promise<T> {
    return serverApiClient.patch<T>(`${this.baseEndpoint}/update/${id}`, data);
  }

  async delete(id: string | number): Promise<void> {
    return serverApiClient.delete<void>(`${this.baseEndpoint}/remove/${id}`);
  }

  async customEndpoint<R>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    data?: any,
    options?: QueryOptions
  ): Promise<R> {
    const url = `${this.baseEndpoint}/${endpoint}${this.buildQueryParams(options)}`;

    switch (method) {
      case 'GET':
        return serverApiClient.get<R>(url);
      case 'POST':
        return serverApiClient.post<R>(url, data);
      case 'PUT':
        return serverApiClient.put<R>(url, data);
      case 'PATCH':
        return serverApiClient.patch<R>(url, data);
      case 'DELETE':
        return serverApiClient.delete<R>(url);
      default:
        throw new Error(`Method ${method} is not supported`);
    }
  }
}

export class ClientResourceService<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>> implements ResourceService<T, CreateDTO, UpdateDTO> {
  private apiClient: any;

  constructor(private readonly baseEndpoint: string) {
    // Dynamically import to avoid SSR issues
    if (typeof window !== 'undefined') {
      const { getClientApiClient } = require('../client-api-client');
      this.apiClient = getClientApiClient();
    }
  }

  private buildQueryParams(options?: QueryOptions): string {
    if (!options) return '';

    const params = new URLSearchParams();
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.sort) params.append('sort', options.sort);
    if (options.order) params.append('order', options.order);

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        params.append(key, String(value));
      });
    }

    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  }

  async getAll(options?: QueryOptions): Promise<T[]> {
    const queryParams = this.buildQueryParams(options);
    return this.apiClient.get(`${this.baseEndpoint}/getAll${queryParams}`) as Promise<T[]>;
  }

  async getById(id: string | number): Promise<T> {
    return this.apiClient.get(`${this.baseEndpoint}/getById/${id}`) as Promise<T>;
  }

  async create(data: CreateDTO): Promise<T> {
    return this.apiClient.post(`${this.baseEndpoint}/create`, data) as Promise<T>;
  }

  async update(id: string | number, data: UpdateDTO): Promise<T> {
    return this.apiClient.patch(`${this.baseEndpoint}/update/${id}`, data) as Promise<T>;
  }

  async delete(id: string | number): Promise<void> {
    return this.apiClient.delete(`${this.baseEndpoint}/remove/${id}`) as Promise<void>;
  }

  async customEndpoint<R>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    data?: any,
    options?: QueryOptions
  ): Promise<R> {
    const url = `${this.baseEndpoint}/${endpoint}${this.buildQueryParams(options)}`;

    switch (method) {
      case 'GET':
        return this.apiClient.get(url) as Promise<R>;
      case 'POST':
        return this.apiClient.post(url, data) as Promise<R>;
      case 'PUT':
        return this.apiClient.put(url, data) as Promise<R>;
      case 'PATCH':
        return this.apiClient.patch(url, data) as Promise<R>;
      case 'DELETE':
        return this.apiClient.delete(url) as Promise<R>;
      default:
        throw new Error(`Method ${method} is not supported`);
    }
  }
}
