interface ServiceConfig {
    host: string | string[];
    port: number;
}

export interface AppConfig {
    AUTH: ServiceConfig;
    USER: ServiceConfig;
    INFRA: ServiceConfig;
    NOTIFICATION: ServiceConfig;
    FILE_STORAGE: ServiceConfig;
}

export enum APP_SERVICE {
    AUTH = 'AUTH',
    USER = 'USER',
    NOTIFICATION = 'NOTIFICATION',
    INFRA = 'INFRA',
    FILE_STORAGE = 'FILE_STORAGE',
}

const DEFAULT_HOST = process.env['DEFAULT_HOST'] || '127.0.0.1';

const DEFAULT_HOST_AUTH = process.env['DEFAULT_HOST_AUTH'] || DEFAULT_HOST;
const DEFAULT_PORT_AUTH = process.env['DEFAULT_PORT_AUTH'] || 3001;

const DEFAULT_HOST_GATEWAY = process.env['DEFAULT_HOST_GATEWAY'] || DEFAULT_HOST;
const DEFAULT_PORT_GATEWAY = process.env['DEFAULT_PORT_GATEWAY'] || 3002;

const DEFAULT_HOST_STORAGE = process.env['DEFAULT_HOST_STORAGE'] || DEFAULT_HOST;
const DEFAULT_PORT_STORAGE = process.env['DEFAULT_PORT_STORAGE'] || 3002;

const DEFAULT_HOST_NOTIFICATION = process.env['DEFAULT_HOST_NOTIFICATION'] || DEFAULT_HOST;
const DEFAULT_PORT_NOTIFICATION = process.env['DEFAULT_PORT_NOTIFICATION'] || 3002;

const DEFAULT_KAFKA_BROKER = [process.env['KAFKA_CLIENT_BROKERS'] || DEFAULT_HOST];
const DEFAULT_KAFKA_PORT = 9092;

export const APP_CONFIG: AppConfig = {
    AUTH: {
        host: process.env['DEFAULT_HOST_AUTH'] || DEFAULT_HOST_AUTH,
        port: Number(process.env['AUTH_PORT'] || DEFAULT_PORT_AUTH)
    },
    USER: {
        host: process.env['DEFAULT_HOST_AUTH'] || DEFAULT_HOST_AUTH,
        port: Number(process.env['AUTH_PORT'] || DEFAULT_PORT_AUTH)
    },
    INFRA: {
        host: process.env['DEFAULT_HOST'] || DEFAULT_HOST,
        port: Number(process.env['AUTH_PORT'] || DEFAULT_PORT_AUTH)
    },
    NOTIFICATION: {
        host: DEFAULT_KAFKA_BROKER,
        port: DEFAULT_KAFKA_PORT
    },
    FILE_STORAGE: {
        //host: DEFAULT_KAFKA_BROKER[0].substring(0, DEFAULT_KAFKA_BROKER[0].indexOf(':')),
        host: process.env['DEFAULT_HOST_STORAGE'] || DEFAULT_HOST_STORAGE,
        port: Number(process.env['DEFAULT_PORT_STORAGE'] || DEFAULT_PORT_STORAGE)
    }
};

export const getAppConfig = (app: keyof AppConfig) => {
    return APP_CONFIG[app];
};



