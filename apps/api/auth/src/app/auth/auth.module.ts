import { DynamicModule, Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserRepository } from '../user/user.repository';
import { PasswordService } from './password.service';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../user/user.controller';
import { AclModule } from '../acl/acl.module';
import {
    AuthJwtModule,
    CoreApiSharedModule,
    User
} from '@able/api-shared';


@Global()
@Module({})
export class AuthModule {

    static forRootAsync(): DynamicModule {
        return {
            module: AuthModule,
            controllers: [AuthController, UserController],
            providers: [UserRepository, PasswordService, UserService, AuthService],
            exports: [PasswordService, UserService, UserRepository],
            imports: [
                TypeOrmModule.forFeature([User]),
                CoreApiSharedModule.forRootAsync(),
                AuthJwtModule.forRootAsync(),
                AclModule,
            ]
        };
    }
}
