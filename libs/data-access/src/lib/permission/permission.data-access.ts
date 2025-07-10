import { ServerResourceService } from "../services/resource.service";

export interface PermissionDto {
    id?: number;
    name: string;
    value?: string;
    deactivatedAt?: Date | null;
    selectedEndpoints?: string[];
    selectedUsers?: string[];
    permissaoEndpoints?: Array<{
        endpoint?: {
            id?: number;
            name?: string;
            value?: string;
            [key: string]: any
        };
        [key: string]: any;
    }>;
    userPermissions?: Array<{
        user?: { id?: number; [key: string]: any };
        [key: string]: any;
    }>;
}

export interface CreatePermissionDto {
    name: string;
    value?: string;
    selectedEndpoints?: string[];
    selectedUsers?: string[];
}

export interface UpdatePermissionDto {
    id: number;
    name?: string;
    value?: string;
    selectedEndpoints?: string[];
    selectedUsers?: string[];
}

class PermissionDataAccess extends ServerResourceService<
    PermissionDto,
    CreatePermissionDto,
    UpdatePermissionDto
> {
    constructor() {
        super("permission");
    }

    async getAll(options?: any): Promise<PermissionDto[]> {
        const permissions = await super.getAll(options);
        if (!permissions) return [];

        return permissions.map((permission) => ({
            ...permission,
            selectedEndpoints:
                permission.permissaoEndpoints
                    ?.map((pe) => pe.endpoint?.id?.toString())
                    .filter((id): id is string => id !== undefined) || [],
            selectedUsers:
                permission.userPermissions
                    ?.map((up) => up.user?.id?.toString())
                    .filter((id): id is string => id !== undefined) || [],
        })) as PermissionDto[];
    }

    async assignPermissionToUser(
        userId: string,
        permissionId: number
    ): Promise<any> {
        return this.customEndpoint("POST", "assign", {
            userId,
            permissionId,
        });
    }


}

export const permissionDataAccess = new PermissionDataAccess();
