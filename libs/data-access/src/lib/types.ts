export interface QueryOptions {
    filters?: Record<string, string | number | boolean>;
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}
