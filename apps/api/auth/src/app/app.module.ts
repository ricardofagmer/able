import {Module} from '@nestjs/common';
import {AclModule} from './acl/acl.module';
import {AuthModule} from './auth/auth.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthJwtModule, CoreApiSharedModule, User, Permission, UserPermission} from "@able/api-shared";

@Module({
    imports: [
        AclModule,
        AuthModule.forRootAsync(),
        TypeOrmModule.forFeature([User, Permission, UserPermission]),
        CoreApiSharedModule.forRootAsync(),
        AuthJwtModule.forRootAsync(),
    ],
    providers: [],
    exports: [AclModule, AuthModule],
})
export class AppModule {
}
