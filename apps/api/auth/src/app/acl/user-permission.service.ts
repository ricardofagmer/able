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

  /**
   * Assign a permission to a user
   */
  async assignPermissionToUser(userId: number, permissionId: number): Promise<UserPermission> {
    // Check if user exists
    const user = await this.userRepository.findOneBy({ id: userId } );
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Check if permission exists
    const permission = await this.permissionRepository.findOne({ where: { id: permissionId } });
    if (!permission) {
      throw new Error(`Permission with ID ${permissionId} not found`);
    }

    // Check if relationship already exists
    const existingRelation = await this.userPermissionRepository.findOne({
      where: { userId, permissionId },
    });

    if (existingRelation) {
      return existingRelation;
    }

    // Create new user-permission relationship
    const userPermission = this.userPermissionRepository.create({
      userId,
      permissionId,
    });

    return await this.userPermissionRepository.save(userPermission);
  }

  /**
   * Remove a permission from a user
   */
  async removePermissionFromUser(userId: string, permissionId: number): Promise<void> {
    const result = await this.userPermissionRepository.delete({
      userId: Number(userId),
      permissionId: Number(permissionId),
    });

    if (result.affected === 0) {
      throw new Error(`User-permission relationship not found`);
    }
  }

  /**
   * Get all permissions for a user
   */
  async getUserPermissions(userId: string): Promise<Permission[]> {
    const userPermissions = await this.userPermissionRepository.find({
      where: { userId: Number(userId) },
      relations: ['permission'],
    });

    return userPermissions.map(up => up.permission);
  }

  /**
   * Get all users with a specific permission
   */
  async getUsersWithPermission(permissionId: number): Promise<User[]> {
    const userPermissions = await this.userPermissionRepository.find({
      where: { permissionId },
      relations: ['user'],
    });

    return userPermissions.map(up => up.user);
  }

  /**
   * Check if a user has a specific permission
   */
  async userHasPermission(userId: string, permissionId: number): Promise<boolean> {
    const userPermission = await this.userPermissionRepository.findOne({
      where: { userId: Number(userId), permissionId },
    });

    return !!userPermission;
  }

  /**
   * Check if a user has a specific permission by permission value
   */
  async userHasPermissionByValue(userId: string, permissionValue: string): Promise<boolean> {
    const permission = await this.permissionRepository.findOne({
      //where: { value: permissionValue },
    });

    if (!permission) {
      return false;
    }

    return await this.userHasPermission(userId, permission.id);
  }

  /**
   * Assign multiple permissions to a user
   */
  async assignMultiplePermissionsToUser(userId: string, permissionIds: number[]): Promise<UserPermission[]> {
    const results: UserPermission[] = [];

    for (const permissionId of permissionIds) {
      try {
        const userPermission = await this.assignPermissionToUser(Number(userId), permissionId);
        results.push(userPermission);
      } catch (error) {
        // Skip if permission already exists or other errors
        console.warn(`Failed to assign permission ${permissionId} to user ${userId}:`, error instanceof Error ? error.message : String(error));
      }
    }

    return results;
  }

  /**
   * Remove all permissions from a user
   */
  async removeAllPermissionsFromUser(userId: string): Promise<void> {
    await this.userPermissionRepository.delete({ userId: Number(userId) });
  }

  /**
   * Get user permissions with pagination
   */
  async getUserPermissionsPaginated(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ permissions: Permission[]; total: number; page: number; limit: number }> {
    const [userPermissions, total] = await this.userPermissionRepository.findAndCount({
      where: { userId: Number(userId) },
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
