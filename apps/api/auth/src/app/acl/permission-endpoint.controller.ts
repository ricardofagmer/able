import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  BulkAssignPermissionsDto,
  BulkAssignEndpointsDto,
  HasAccessResponseDto,
} from './dto/permission-endpoint.dto';
import { PermissionEndpointService } from './permission-endpoint.service';
import { EndpointWeb, PermissaoEndpoint, Permission } from '@able/api-shared';
import {AssignPermissionToUserDto, UserPermissionResponseDto} from "./dto/user-permission.dto";
import {UserPermissionService} from "./user-permission.service";

@Controller('permission')
export class PermissionEndpointController {
  constructor(
    private readonly permissionEndpointService: PermissionEndpointService,
    private readonly userPermissionService: UserPermissionService
  ) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async assignPermissionToEndpoint(
    @Body() assignPermissionDto: any
  ): Promise<any> {
    return await this.permissionEndpointService.create(
      assignPermissionDto.name,
      assignPermissionDto.selectedEndpoints || assignPermissionDto.endpointIds,
      assignPermissionDto.selectedUsers || assignPermissionDto.userIds
    );
  }

    @Post('assign')
    @HttpCode(HttpStatus.CREATED)
    async assignPermissionToUser(
        @Body() assignPermissionDto: AssignPermissionToUserDto
    ): Promise<UserPermissionResponseDto> {
        const userPermission = await this.userPermissionService.assignPermissionToUser(
            +assignPermissionDto.userId,
            assignPermissionDto.permissionId
        );

        return {
            userId: String(userPermission.userId),
            permissionId: userPermission.permissionId,
            assignedAt: userPermission.assignedAt,
        };
    }

  @Delete('remove/:permissionId/:endpointId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removePermissionFromEndpoint(
    @Param('permissionId', ParseIntPipe) permissionId: number,
    @Param('endpointId', ParseIntPipe) endpointId: number,
  ): Promise<void> {
    return this.permissionEndpointService.removePermissionFromEndpoint(
      permissionId,
      endpointId,
    );
  }

  @Get('permission/:permissionId/endpoints')
  async getEndpointsByPermission(
    @Param('permissionId', ParseIntPipe) permissionId: number,
  ): Promise<EndpointWeb[]> {
    return this.permissionEndpointService.getEndpointsByPermission(permissionId);
  }

  @Get('endpoint-/:endpointId/permissions')
  async getPermissionsByEndpoint(
    @Param('endpointId', ParseIntPipe) endpointId: number,
  ): Promise<Permission[]> {
    return this.permissionEndpointService.getPermissionsByEndpoint(endpointId);
  }

  @Get('check/:permissionId/:endpointId')
  async hasPermissionForEndpoint(
    @Param('permissionId', ParseIntPipe) permissionId: number,
    @Param('endpointId', ParseIntPipe) endpointId: number,
  ): Promise<HasAccessResponseDto> {
    const hasAccess = await this.permissionEndpointService.hasPermissionForEndpoint(
      permissionId,
      endpointId,
    );
    return { hasAccess };
  }

  @Get('getAll')
  async getAllPermissionEndpoints(): Promise<any[]> {
    return this.permissionEndpointService.getAllPermissionEndpoints();
  }

  @Post('bulk-assign-permissions')
  @HttpCode(HttpStatus.CREATED)
  async assignMultiplePermissionsToEndpoint(
    @Body() body: BulkAssignPermissionsDto,
  ): Promise<PermissaoEndpoint[]> {
    return this.permissionEndpointService.assignMultiplePermissionsToEndpoint(
      body.permissionIds,
      body.endpointId,
    );
  }

  @Post('bulk-assign-endpoints')
  @HttpCode(HttpStatus.CREATED)
  async assignMultipleEndpointsToPermission(
    @Body() body: BulkAssignEndpointsDto,
  ): Promise<PermissaoEndpoint[]> {
    return this.permissionEndpointService.assignMultipleEndpointsToPermission(
      body.permissionId,
      body.endpointIds,
    );
  }

  @Delete('remove/:permissionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePermission(
    @Param('permissionId', ParseIntPipe) permissionId: number,
  ): Promise<void> {
    return this.permissionEndpointService.deletePermission(permissionId);
  }
}
