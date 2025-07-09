import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    Query,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
    Patch,
} from "@nestjs/common";
import { PermissionEndpointService } from "./permission-endpoint.service";
import { Permission } from "@able/api-shared";

interface CreatePermissionDto {
    name: string;
    selectedEndpoints?: number[];
    selectedUsers?: string[];
}

interface UpdatePermissionDto {
    name?: string;
    selectedEndpoints?: number[];
    selectedUsers?: string[];
}

interface PermissionQueryDto {
    page?: number;
    limit?: number;
    search?: string;
}

@Controller("permission")
export class PermissionsController {
    constructor(
        private readonly permissionEndpointService: PermissionEndpointService
    ) {}

    /**
     * Create a new permission
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPermission(
        @Body() createPermissionDto: CreatePermissionDto
    ): Promise<Permission> {
        return await this.permissionEndpointService.create(
            createPermissionDto.name,
            createPermissionDto.selectedEndpoints || [],
            (createPermissionDto.selectedUsers || []).map(Number)
        );
    }

    /**
     * Get all permissions with their relationships
     */
    @Get()
    async getAllPermissions(
        @Query() query: PermissionQueryDto
    ): Promise<Permission[]> {
        return await this.permissionEndpointService.getAllPermissionEndpoints();
    }

    /**
     * Get a specific permission by ID
     */
    @Get(":id")
    async getPermissionById(
        @Param("id", ParseIntPipe) id: number
    ): Promise<Permission> {
        const permissions =
            await this.permissionEndpointService.getAllPermissionEndpoints();
        const permission = permissions.find((p) => p.id === id);

        if (!permission) {
            throw new Error(`Permission with ID ${id} not found`);
        }

        return permission;
    }

    /**
     * Update a permission
     */
    @Patch('update/:id')
    async updatePermission(
        @Param("id", ParseIntPipe) id: number,
        @Body() updatePermissionDto: UpdatePermissionDto
    ): Promise<Permission> {
        // First delete the existing permission
        await this.permissionEndpointService.deletePermission(id);

        // Then create a new one with updated data
        return await this.permissionEndpointService.create(
            updatePermissionDto.name || `Updated Permission ${id}`,
            updatePermissionDto.selectedEndpoints || [],
            (updatePermissionDto.selectedUsers || []).map(Number)
        );
    }

    /**
     * Delete a permission
     */
    @Delete("remove/:id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePermission(
        @Param("id", ParseIntPipe) id: number
    ): Promise<void> {
        return await this.permissionEndpointService.deletePermission(id);
    }

    /**
     * Get permissions with pagination
     */
    @Get("paginated")
    async getPermissionsPaginated(@Query() query: PermissionQueryDto): Promise<{
        permissions: Permission[];
        total: number;
        page: number;
        limit: number;
    }> {
        const permissions =
            await this.permissionEndpointService.getAllPermissionEndpoints();
        const page = query.page || 1;
        const limit = query.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        let filteredPermissions = permissions;

        // Apply search filter if provided
        if (query.search) {
            filteredPermissions = permissions.filter((permission) =>
                permission.name
                    .toLowerCase()
                    .includes(query.search!.toLowerCase())
            );
        }

        const paginatedPermissions = filteredPermissions.slice(
            startIndex,
            endIndex
        );

        return {
            permissions: paginatedPermissions,
            total: filteredPermissions.length,
            page,
            limit,
        };
    }
}
