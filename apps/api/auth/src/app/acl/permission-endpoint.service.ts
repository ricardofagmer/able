import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {EndpointWeb, PermissaoEndpoint, Permission, UserPermission} from "@able/api-shared";


@Injectable()
export class PermissionEndpointService {
  constructor(
    @InjectRepository(PermissaoEndpoint)
    private permissaoEndpointRepository: Repository<PermissaoEndpoint>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(EndpointWeb)
    private endpointRepository: Repository<EndpointWeb>,
    @InjectRepository(UserPermission)
    private userPermissionRepository: Repository<UserPermission>,
  ) {}


  async create(
    name: string,
    endpointIds: Number[],
    userIds: Number[],
  ): Promise<Permission> {
    // First, create the permission
    const permission = await this.permissionRepository.save({ name });

    // Then create the permission-endpoint relationships
    if (endpointIds && endpointIds.length > 0) {
      const permissionEndpoints = endpointIds.map(endpointId =>
        this.permissaoEndpointRepository.create({ 
          permissaoId: permission.id, 
          endpointId: Number(endpointId) 
        })
      );
      await this.permissaoEndpointRepository.save(permissionEndpoints);
    }

    // Then create the user-permission relationships
    if (userIds && userIds.length > 0) {
      const userPermissions = userIds.map(userId =>
        this.userPermissionRepository.create({ 
          userId: Number(userId), 
          permissionId: permission.id 
        })
      );
      await this.userPermissionRepository.save(userPermissions);
    }

    return permission;
  }


  async removePermissionFromEndpoint(
    permissionId: number,
    endpointId: number,
  ): Promise<void> {
    await this.permissaoEndpointRepository.delete({
      permissaoId: permissionId,
      endpointId,
    });
  }


  async getEndpointsByPermission(permissionId: number): Promise<EndpointWeb[]> {
    const permissionEndpoints = await this.permissaoEndpointRepository.find({
      where: { permissaoId: permissionId },
      relations: ['endpoint'],
    });
    return permissionEndpoints.map(pe => pe.endpoint);
  }


  async getPermissionsByEndpoint(endpointId: number): Promise<Permission[]> {
    const permissionEndpoints = await this.permissaoEndpointRepository.find({
      where: { endpointId },
      relations: ['permission'],
    });
    return permissionEndpoints.map(pe => pe.permission);
  }


  async hasPermissionForEndpoint(
    permissionId: number,
    endpointId: number,
  ): Promise<boolean> {
    const count = await this.permissaoEndpointRepository.count({
      where: { permissaoId: permissionId, endpointId },
    });
    return count > 0;
  }


  async getAllPermissionEndpoints(): Promise<Permission[]> {
    return this.permissionRepository.find({
      relations: [
        'permissaoEndpoints', 
        'permissaoEndpoints.endpoint',
        'userPermissions',
        'userPermissions.user'
      ],
    });
  }


  async assignMultiplePermissionsToEndpoint(
    permissionIds: number[],
    endpointId: number,
  ): Promise<PermissaoEndpoint[]> {
    const permissionEndpoints = permissionIds.map(permissionId =>
      this.permissaoEndpointRepository.create({ permissaoId: permissionId, endpointId })
    );
    return this.permissaoEndpointRepository.save(permissionEndpoints);
  }

  async assignMultipleEndpointsToPermission(
    permissionId: number,
    endpointIds: number[],
  ): Promise<PermissaoEndpoint[]> {
    const permissionEndpoints = endpointIds.map(endpointId =>
      this.permissaoEndpointRepository.create({ permissaoId: permissionId, endpointId })
    );
    return this.permissaoEndpointRepository.save(permissionEndpoints);
  }

  async deletePermission(permissionId: number): Promise<void> {
    // Check if permission exists
    const permission = await this.permissionRepository.findOne({ where: { id: permissionId } });
    if (!permission) {
      throw new Error(`Permission with ID ${permissionId} not found`);
    }

    // Delete permission-endpoint relationships
    await this.permissaoEndpointRepository.delete({ permissaoId: permissionId });

    // Delete user-permission relationships
    await this.userPermissionRepository.delete({ permissionId });

    // Finally, delete the permission itself
    await this.permissionRepository.delete({ id: permissionId });
  }
}
