import { IsNumber, IsArray, ArrayNotEmpty } from 'class-validator';

export class AssignPermissionToEndpointDto {
  @IsNumber()
  permissionId: number;

  @IsNumber()
  endpointId: number;
}

export class BulkAssignPermissionsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  permissionIds: number[];

  @IsNumber()
  endpointId: number;
}

export class BulkAssignEndpointsDto {
  @IsNumber()
  permissionId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  endpointIds: number[];
}

export class PermissionEndpointResponseDto {
  permissionId: number;
  endpointId: number;
  permission?: {
    id: number;
    name: string;
    value: string;
  };
  endpoint?: {
    id: number;
    name: string;
    value: string;
  };
}

export class HasAccessResponseDto {
  hasAccess: boolean;
}
