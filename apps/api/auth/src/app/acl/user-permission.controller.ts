import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserPermissionService } from './user-permission.service';
import {
  AssignPermissionToUserDto,
  BulkAssignPermissionsToUserDto,
  BulkAssignUsersToPermissionDto,
  UserPermissionResponseDto,
  UserHasPermissionResponseDto,
  GetUserPermissionsQueryDto,
  CheckPermissionByValueDto,
} from './dto/user-permission.dto';

@Controller('user-permissions')
export class UserPermissionController {
  constructor(private readonly userPermissionService: UserPermissionService) {}


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

  @Delete('remove/:userId/:permissionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removePermissionFromUser(
    @Param('userId') userId: string,
    @Param('permissionId') permissionId: number
  ): Promise<void> {
    await this.userPermissionService.removePermissionFromUser(userId, +permissionId);
  }


  @Get('user/:userId/permissions')
  async getUserPermissions(@Param('userId') userId: string) {
    return await this.userPermissionService.getUserPermissions(userId);
  }

  @Get('permission/:permissionId/users')
  async getUsersWithPermission(@Param('permissionId') permissionId: number) {
    return await this.userPermissionService.getUsersWithPermission(+permissionId);
  }


  @Get('check/:userId/:permissionId')
  async userHasPermission(
    @Param('userId') userId: string,
    @Param('permissionId') permissionId: number
  ): Promise<UserHasPermissionResponseDto> {
    const hasPermission = await this.userPermissionService.userHasPermission(
      userId,
      +permissionId
    );

    return { hasPermission };
  }

  @Post('check-by-value')
  async userHasPermissionByValue(
    @Body() checkPermissionDto: CheckPermissionByValueDto
  ): Promise<UserHasPermissionResponseDto> {
    const hasPermission = await this.userPermissionService.userHasPermissionByValue(
      checkPermissionDto.userId,
      checkPermissionDto.permissionValue
    );

    return { hasPermission };
  }


  @Post('bulk-assign-to-user')
  @HttpCode(HttpStatus.CREATED)
  async assignMultiplePermissionsToUser(
    @Body() bulkAssignDto: BulkAssignPermissionsToUserDto
  ): Promise<UserPermissionResponseDto[]> {
    const userPermissions = await this.userPermissionService.assignMultiplePermissionsToUser(
      bulkAssignDto.userId,
      bulkAssignDto.permissionIds
    );

    return userPermissions.map(up => ({
      userId: String(up.userId),
      permissionId: up.permissionId,
      assignedAt: up.assignedAt,
    }));
  }

  @Post('bulk-assign-to-permission')
  @HttpCode(HttpStatus.CREATED)
  async assignPermissionToMultipleUsers(
    @Body() bulkAssignDto: BulkAssignUsersToPermissionDto
  ): Promise<UserPermissionResponseDto[]> {
    const results: UserPermissionResponseDto[] = [];

    for (const userId of bulkAssignDto.userIds) {
      try {
        const userPermission = await this.userPermissionService.assignPermissionToUser(
          +userId,
          bulkAssignDto.permissionId
        );
        results.push({
          userId: String(userPermission.userId),
          permissionId: userPermission.permissionId,
          assignedAt: userPermission.assignedAt,
        });
      } catch (error) {
        console.warn(`Failed to assign permission to user ${userId}:`, error instanceof Error ? error.message : String(error));
      }
    }

    return results;
  }


  @Delete('user/:userId/permissions')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAllPermissionsFromUser(@Param('userId') userId: string): Promise<void> {
    await this.userPermissionService.removeAllPermissionsFromUser(userId);
  }

  @Get('user/:userId/permissions/paginated')
  async getUserPermissionsPaginated(
    @Param('userId') userId: string,
    @Query() query: GetUserPermissionsQueryDto
  ): Promise<any> {
    const result = await this.userPermissionService.getUserPermissionsPaginated(
      userId,
      query.page,
      query.limit
    );

    return {
      permissions: result.permissions.map(p => ({
        id: p.id,
        name: p.name,
        deactivatedAt: p.deactivatedAt,
      })),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }
}
