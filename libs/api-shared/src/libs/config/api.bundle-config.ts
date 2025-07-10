import { TYPEORM_MODULE_CONFIG } from './typeorm.module-config';
import { REDIS_CACHE_MODULE_CONFIG } from './cache.module-config';

export const apiBundleConfig = {
    TypeOrmModule: TYPEORM_MODULE_CONFIG,
    RedisCacheModule: REDIS_CACHE_MODULE_CONFIG,
};
