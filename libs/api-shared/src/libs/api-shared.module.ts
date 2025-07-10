import { DynamicModule, Global, Module } from '@nestjs/common';
import { EnvModule } from './env/src/lib/env.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { apiBundleConfig } from './config/api.bundle-config';
import { CacheModule } from '@nestjs/cache-manager';

@Global()
@Module({})
export class CoreApiSharedModule {
    static forRootAsync(config?: {
        i18nPathFile?: string
    }): DynamicModule {
        const moduleConfigs = {
            ...apiBundleConfig
        };

        const PROJECT_MODULES = [
            EnvModule
        ];

        const NEST_MODULES = [
            TypeOrmModule.forRootAsync(moduleConfigs.TypeOrmModule()),
            CacheModule.registerAsync(moduleConfigs.RedisCacheModule()),
            ThrottlerModule.forRoot([{
                ttl: 60,
                limit: 1000
            }])
        ];

        return {
            module: CoreApiSharedModule,
            providers: [],
            imports: [...NEST_MODULES, ...PROJECT_MODULES],
            exports: [...NEST_MODULES, ...PROJECT_MODULES]
        };
    }
}
