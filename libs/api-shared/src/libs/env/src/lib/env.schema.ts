import { z } from 'zod';

export const EnvironmentSchema = z.object({
    ABLE_ENV: z.enum(['test', 'development', 'production'])
});

export const DataBaseSchema = z.object({
    DB_HOST: z.string(),
    DB_TYPE: z
        .enum(['mysql', 'postgres', 'mariadb', 'sqlite', 'mssql'])
        .default('mysql'),
    DB_NAME: z.string(),
    DB_USERNAME: z.string(),
    DB_PORT: z.coerce.number(),
    DB_PASSWORD: z.string(),
    DB_LOGGING: z.string(),
    DB_SYNCHRONIZE: z.string(),
    DB_SCHEMA: z.string(),
    REDIS_DB_HOST: z.string(),
    REDIS_DB_PORT: z.coerce.number().positive().int().default(6379),
    REDIS_DB_NUM: z.coerce.number().positive().int().default(1),
    REDIS_DB_PASSWORD: z.string(),
    REDIS_DB_KEY_PREFIX: z.string().optional(),
    REDIS_TTL: z.string().default('30d')
});

export const appSchema = z.object({
    PROJECT_NAME: z.string().default('ableonc'),
    WEB_HOST: z.string().default('localhost'),
    IS_PUBLIC: z.coerce.boolean().optional().default(true),
    APP_KEY: z.string(),
    USER_PASSWORD_HASH_ROUNDS: z.coerce.number().positive().int().default(12),
    JWT_EXPIRES_IN: z.string().default('4days'),
    JWT_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    JWT_REFRESH_EXPIRES_IN: z.string().default('4days'),
    DEFAULT_LANGUAGE: z.string().default('en'),
    MASTER_NODE: z.coerce.boolean().default(false),
    THROTTLER_TTL: z.coerce.number().positive().int().default(60),
    THROTTLER_LIMIT: z.coerce.number().positive().int().default(65535),
});




export const configSchema = z.object({
    ENV: EnvironmentSchema,
    APP: appSchema,
    DATABASE: DataBaseSchema,
});

export type Env = z.infer<typeof configSchema>;
