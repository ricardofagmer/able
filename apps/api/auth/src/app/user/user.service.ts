import {HttpException, HttpStatus, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {PasswordService} from '../auth/password.service';
import {UserRepository} from './user.repository';
import {ConfirmAccountDto, ResendConfirmationEmailDto, UserDto, UserResponseDto} from '@able/common';
import {EnvService} from '@able/api-shared';
import {v4 as uuidv4} from 'uuid';
import {CACHE_MANAGER} from '@nestjs/cache-manager';
import {Cache} from 'cache-manager';
import {UserPermissionService} from '../acl/user-permission.service';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordService: PasswordService,
        private readonly envService: EnvService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly userPermissionService: UserPermissionService
    ) {
    }


    async findOne(id: number): Promise<any> {
        const data = await this.userRepository.findById(id);

        if (!data) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return data;
    }

    async create(request: UserDto): Promise<any> {
        const existingUser = await this.userRepository.findByEmail(request.email);
        if (existingUser) {
            throw new HttpException(
                'Account already exists',
                HttpStatus.CONFLICT
            );
        }

        const password = await this.passwordService.hashPassword(request.password);
        const account = await this.userRepository.createUser({
            ...request, password,
            isActive: true,
            permissions: [],
            createdAt: undefined,
            updatedAt: undefined,
            userPermissions: []
        });

        if (account) {
            const token = uuidv4();
            const ttl = this.envService.get('APP').JWT_REFRESH_EXPIRES_IN;

            const cacheKey = `ableRefreshToken${account.id}`;
            await this.cacheManager.set(cacheKey, token, +ttl);
        }

        return account;
    }

    async update(id: number, updateUserDto: any): Promise<any> {
        const data = await this.findOne(id);

        // Handle permissions update if provided
        if (updateUserDto.permissions !== undefined) {
            const newPermissionIds = updateUserDto.permissions.map((p: any) => Number(p.id || p));

            // Get current permissions
            const currentPermissions = await this.userPermissionService.getUserPermissions(id.toString());
            const currentPermissionIds = currentPermissions.map(p => p.id);

            // Remove permissions that are no longer selected
            const permissionsToRemove = currentPermissionIds.filter(id => !newPermissionIds.includes(id));
            for (const permissionId of permissionsToRemove) {
                await this.userPermissionService.removePermissionFromUser(id.toString(), permissionId);
            }

            // Add new permissions
            const permissionsToAdd = newPermissionIds.filter(id => !currentPermissionIds.includes(id));
            for (const permissionId of permissionsToAdd) {
                await this.userPermissionService.assignPermissionToUser(id, permissionId);
            }

            // Remove permissions from updateUserDto to avoid trying to update it directly
            delete updateUserDto.permissions;
        }

        Object.assign(data, updateUserDto);
        return this.userRepository.updateUser(id, data);
    }

    async getById(id: number): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new HttpException(
                'Account not found',
                HttpStatus.NOT_FOUND
            );
        }

        // Fetch user permissions
        const permissions = await this.userPermissionService.getUserPermissions(id.toString());

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            permissions: permissions
        };
    }

    async getAll(): Promise<any> {
        const users = await this.userRepository.findAll();

        return await Promise.all(
            users.map(async (user) => {
                const permissions = await this.userPermissionService.getUserPermissions(user.id.toString());
                return {
                    ...user,
                    permissions: permissions,
                    permissionsCount: permissions.length
                };
            })
        );
    }

    async confirmAccount(request: ConfirmAccountDto): Promise<boolean> {
        const user = await this.userRepository.findByEmail(request.email);

        if (!user) {
            throw new HttpException(
                'Account not found',
                HttpStatus.NOT_FOUND
            );
        }

        const cacheKey = `ableRefreshToken${user.id}`;
        const storedToken = await this.cacheManager.get(cacheKey);



        if (!storedToken || storedToken !== request.token) {
            throw new HttpException(
                'Invalid token',
                HttpStatus.UNAUTHORIZED
            );
        }

        await this.userRepository.updateUser(user.id, { ...user });
        await this.cacheManager.del(cacheKey);

        return true;
    }

    async sendConfirmationEmail(request: ResendConfirmationEmailDto): Promise<void> {
        const user = await this.userRepository.findByEmail(request.email);

        if (!user) {
            throw new HttpException(
                'Account not found',
                HttpStatus.NOT_FOUND
            );
        }

        await this.emailConfirmation(request);
    }

    async checkAndRenewToken(userId: number) {
        const token = uuidv4();
        const ttl = this.envService.get('APP').JWT_REFRESH_EXPIRES_IN;

        const cacheKey = `ableRefreshToken${userId}`;
        await this.cacheManager.set(cacheKey, token, +ttl);

        return {
            ttl,
            token
        };
    }

    async emailConfirmation(payload: ResendConfirmationEmailDto): Promise<string> {
        const { email } = payload;

        const user = await this.userRepository.findByEmail(email);
        const { ttl, token } = await this.checkAndRenewToken(user.id);

        // TODO: Implement email confirmation logic if needed
        // Token generated and stored in cache

        return token;
    }

    async checkUserExists(email: string): Promise<any> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            return null;
        }

        const endpoints = user.userPermissions?.flatMap(up =>
            up.permission?.permissaoEndpoints?.map(pe => pe.endpoint) || []
        ) || [];

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            permissions: endpoints.map(i => i.value)
        };
    }
}
