import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEndpointService } from './permission-endpoint.service';
import { UserPermissionService } from './user-permission.service';
import { EndpointService } from './endpoint.service';
import { PermissionEndpointController } from './permission-endpoint.controller';
import { UserPermissionController } from './user-permission.controller';
import { EndpointController } from './endpoint.controller';
import { PermissionsController } from './permissions.controller';
import {EndpointWeb, PermissaoEndpoint, Permission, UserPermission, User} from "@able/api-shared";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Permission,
      EndpointWeb,
      PermissaoEndpoint,
      UserPermission, User,
    ]),
  ],
  controllers: [PermissionEndpointController, UserPermissionController, EndpointController, PermissionsController],
  providers: [PermissionEndpointService, UserPermissionService, EndpointService],
  exports: [PermissionEndpointService, UserPermissionService, EndpointService, TypeOrmModule],
})
export class AclModule {}
