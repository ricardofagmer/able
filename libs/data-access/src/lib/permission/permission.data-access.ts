import { ServerResourceService } from "../services/resource.service";

export interface PermissionDto {
    id?: number;
    name: string;
    value?: string;
    deactivatedAt?: Date | null;
    selectedEndpoints?: string[];
    selectedUsers?: string[];
    // API response structure
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

        // Transform the API response to match frontend expectations
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



    async getUserPermissions(userId: string): Promise<PermissionDto[]> {
        return this.customEndpoint("GET", `user-permissions/user/${userId}`);
    }

    async assignPermissionToEndpoint(
        permissionId: number,
        endpointId: number
    ): Promise<any> {
        return this.customEndpoint("POST", "acl/permission-endpoint-/assign", {
            permissionId,
            endpointId,
        });
    }

    async removePermissionFromEndpoint(
        permissionId: number,
        endpointId: number
    ): Promise<void> {
        return this.customEndpoint(
            "DELETE",
            `acl/permission-endpoint-/remove/${permissionId}/${endpointId}`
        );
    }

    async getEndpointsByPermission(permissionId: number): Promise<any[]> {
        return this.customEndpoint(
            "GET",
            `acl/permission-endpoint-/permission/${permissionId}/endpoints`
        );
    }

    async getPermissionsByEndpoint(
        endpointId: number
    ): Promise<PermissionDto[]> {
        return this.customEndpoint(
            "GET",
            `acl/permission-endpoint-/endpoint/${endpointId}/permissions`
        );
    }
}

export const permissionDataAccess = new PermissionDataAccess();
