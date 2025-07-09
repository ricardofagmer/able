import { DynamicModule, Global, Module } from '@nestjs/common';
import { EnvModule } from './env/src/lib/env.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { apiBundleConfig } from './config/api.bundle-config';
import { CacheModule } from '@nestjs/cache-manager';
import { I18nModule } from 'nestjs-i18n';
import { MailerModule } from '@nestjs-modules/mailer';

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
            I18nModule.forRootAsync(moduleConfigs.I18nModule(config?.i18nPathFile)),
            MailerModule.forRootAsync(moduleConfigs.MailerModule()),
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
