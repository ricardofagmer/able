import { configSchema, Env } from './env.schema';

export const envFactory = (): Env => {
    return configSchema.parse({
        ENV: {
            ABLE_ENV: process.env['ABLE_ENV'] as any
        },
        APP: {
            IS_PUBLIC: process.env['IS_PUBLIC'] as any,
            APP_KEY: process.env['APP_KEY'] as any,
            USER_PASSWORD_HASH_ROUNDS: process.env['USER_PASSWORD_HASH_ROUNDS'] as any,
            JWT_EXPIRES_IN: process.env['JWT_EXPIRES_IN'] as any,
            JWT_SECRET: process.env['JWT_SECRET'] as any,
            JWT_REFRESH_SECRET: process.env['JWT_REFRESH_SECRET'] as any,
            JWT_REFRESH_EXPIRES_IN: process.env['JWT_REFRESH_EXPIRES_IN'] as any,
            MASTER_NODE: process.env['MASTER_NODE'] as any,
            THROTTLER_TTL: process.env['THROTTLER_TTL'] as any,
            THROTTLER_LIMIT: process.env['THROTTLER_LIMIT'] as any,
            DEFAULT_LANGUAGE: process.env['DEFAULT_LANGUAGE'] as any,
            I18N_PATH: process.env['I18N_PATH'] as any,
            PROJECT_NAME: process.env['PROJECT_NAME'] as any,
            WEB_HOST: process.env['WEB_HOST'] as any,
        },
        DATABASE: {
            DB_HOST: process.env['DB_HOST'] as any,
            DB_TYPE: process.env['DB_TYPE'] as any,
            DB_NAME: process.env['DB_NAME'] as any,
            DB_USERNAME: process.env['DB_USERNAME'] as any,
            DB_PORT: process.env['DB_PORT'] as any,
            DB_PASSWORD: process.env['DB_PASSWORD'] as any,
            DB_SCHEMA: process.env['DB_SCHEMA'] as any,
            DB_LOGGING: process.env['DB_LOGGING'] as any,
            DB_SYNCHRONIZE: process.env['DB_SYNCHRONIZE'] as any,

            REDIS_DB_HOST: process.env['REDIS_DB_HOST'] as any,
            REDIS_DB_PORT: process.env['REDIS_DB_PORT'] as any,
            REDIS_DB_NUM: process.env['REDIS_DB_NUM'] as any,
            REDIS_DB_PASSWORD: process.env['REDIS_DB_PASSWORD'] as any,
            REDIS_DB_KEY_PREFIX: process.env['REDIS_DB_KEY_PREFIX'] as any,
            REDIS_TTL: process.env['REDIS_TTL'] as any
        },

    });
};
