import {Permission, User, UserPermission} from '@able/api-shared';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserPermissionService {
  constructor(
    @InjectRepository(UserPermission)
    private userPermissionRepository: Repository<UserPermission>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}


  async assignPermissionToUser(userId: number, permissionId: number): Promise<UserPermission> {
    const user = await this.userRepository.findOneBy({ id: userId } );
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const permission = await this.permissionRepository.findOne({ where: { id: permissionId } });
    if (!permission) {
      throw new Error(`Permission with ID ${permissionId} not found`);
    }

    const userIdStr = userId.toString();

    const existingRelation = await this.userPermissionRepository.findOne({
      where: { userId: +userIdStr, permissionId: permissionId },
    });

    if (existingRelation) {
      return existingRelation;
    }

    const userPermission = this.userPermissionRepository.create({
      userId: +userIdStr,
      permissionId,
    });

    return await this.userPermissionRepository.save(userPermission);
  }

  async removePermissionFromUser(userId: string, permissionId: number): Promise<void> {

      console.log('really?',userId, permissionId)

    const result = await this.userPermissionRepository.delete({
      userId: +userId,
      permissionId: permissionId,
    });

    if (result.affected === 0) {
      throw new Error(`User-permission relationship not found`);
    }
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    const userPermissions = await this.userPermissionRepository.find({
      where: { userId: +userId },
      relations: ['permission', 'permission.permissaoEndpoints', 'permission.permissaoEndpoints.endpoint'],
    });

    return userPermissions.map(up => up.permission);
  }


  async getUsersWithPermission(permissionId: number): Promise<User[]> {
    const userPermissions = await this.userPermissionRepository.find({
      where: { permissionId },
      relations: ['user'],
    });

    return userPermissions.map(up => up.user);
  }


  async userHasPermission(userId: string, permissionId: number): Promise<boolean> {
    const userPermission = await this.userPermissionRepository.findOne({
      where: { userId: +userId, permissionId },
    });

    return !!userPermission;
  }


  async userHasPermissionByValue(userId: string, permissionValue: string): Promise<boolean> {
    const permission = await this.permissionRepository.findOne({
    });

    if (!permission) {
      return false;
    }

    return await this.userHasPermission(userId, permission.id);
  }


  async assignMultiplePermissionsToUser(userId: string, permissionIds: number[]): Promise<UserPermission[]> {
    const results: UserPermission[] = [];

    for (const permissionId of permissionIds) {
      try {
        const userPermission = await this.assignPermissionToUser(Number(userId), permissionId);
        results.push(userPermission);
      } catch (error) {
        console.warn(`Failed to assign permission ${permissionId} to user ${userId}:`, error instanceof Error ? error.message : String(error));
      }
    }

    return results;
  }


  async removeAllPermissionsFromUser(userId: string): Promise<void> {
    await this.userPermissionRepository.delete({ userId: +userId }); // Keep as string
  }


  async getUserPermissionsPaginated(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ permissions: Permission[]; total: number; page: number; limit: number }> {
    const [userPermissions, total] = await this.userPermissionRepository.findAndCount({
      where: { userId: +userId },
      relations: ['permission'],
      skip: (page - 1) * limit,
      take: limit,
    });

    const permissions = userPermissions.map(up => up.permission);

    return {
      permissions,
      total,
      page,
      limit,
    };
  }
}
