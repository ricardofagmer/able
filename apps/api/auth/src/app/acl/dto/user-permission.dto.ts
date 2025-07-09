import { IsString, IsNumber, IsArray, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class AssignPermissionToUserDto {
  @IsString()
  userId: string;

  @IsNumber()
  @Type(() => Number)
  permissionId: number;
}

export class BulkAssignPermissionsToUserDto {
  @IsString()
  userId: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  permissionIds: number[];
}

export class BulkAssignUsersToPermissionDto {
  @IsNumber()
  @Type(() => Number)
  permissionId: number;

  @IsArray()
  @IsString({ each: true })
  userIds: string[];
}

export class UserPermissionResponseDto {
  userId: string;
  permissionId: number;
  assignedAt: Date;
}

export class UserHasPermissionResponseDto {
  hasPermission: boolean;
}

export class GetUserPermissionsQueryDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 10;
}

export class UserPermissionsPaginatedResponseDto {
  permissions: {
    id: number;
    name: string;
    value: string;
    deactivatedAt: Date | null;
  }[];
  total: number;
  page: number;
  limit: number;
}

export class CheckPermissionByValueDto {
  @IsString()
  userId: string;

  @IsString()
  permissionValue: string;
}