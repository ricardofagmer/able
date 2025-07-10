import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
    ConfirmPasswordDto,
    LoginDto,
    LogoutDto,
    RefreshTokenDto,
    RefreshTokenResponse,
    ResetPasswordDto,
} from '@able/common';
import { EnvService, User } from '@able/api-shared';

@Injectable()
export class AuthService {
    constructor(private readonly userRepository: UserRepository,
                private readonly jwtService: JwtService,
                private readonly envService: EnvService,
                @Inject(CACHE_MANAGER) private cacheManager: Cache,

    ) {}

    async validateUser(payload: LoginDto): Promise<Omit<User, "password">> {
        const user = await this.userRepository.findByEmail(payload.email);

        if (!user) return null;

        const isMatch = await bcrypt.compare(payload.password, user.password);

        return isMatch ? user : null;
    }

    async login(payload: LoginDto) {
        const user = await this.validateUser(payload);

        if (!user) throw new HttpException(
            'Invalid credentials',
            HttpStatus.UNAUTHORIZED
        );

        const refreshToken = this.generateRefreshToken();
        const rest = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(rest);

        const ttl = this.envService.get('APP').JWT_REFRESH_EXPIRES_IN;
        await this.cacheManager.set(`ableRefreshToken:${user.id}`, refreshToken, +ttl);

        return {
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            accessToken,
            refreshToken
        };
    }

    generateRefreshToken(): string {
        return uuidv4();
    }

    async refreshAccessToken(payload: RefreshTokenDto): Promise<RefreshTokenResponse> {
        const storedRefreshToken = await this.cacheManager.get(`ableRefreshToken:${payload.userId}`);

        if (!storedRefreshToken || storedRefreshToken !== payload.refreshToken) {
            throw new HttpException(
                'Invalid refresh token',
                HttpStatus.UNAUTHORIZED
            );
        }

        const user = await this.userRepository.findById(payload.userId);
        if (!user) {
            throw new HttpException('User not found',
                HttpStatus.NOT_FOUND
            );
        }

        const rest = { username: user.name, sub: user.id };
        const accessToken = this.jwtService.sign(rest);

        return { accessToken };
    }

    async logout(payload: LogoutDto): Promise<void> {
        const cacheKey = `ableRefreshToken:${payload.userId}`;
        const storedRefreshToken = await this.cacheManager.get(cacheKey);

        if (!storedRefreshToken) {
            throw new HttpException(
                'Invalid refresh token',
                HttpStatus.NOT_FOUND
            );
        }

        await this.cacheManager.del(cacheKey);
    }

    async resetPassword({ email }: ResetPasswordDto): Promise<void> {
        const user = await this.userRepository.findByEmail(email);

        await this.cacheManager.del(`ableRefreshToken:${user.id}`);

        if (!user) {
            throw new HttpException('User not found',
                HttpStatus.NOT_FOUND
            );
        }

        const resetToken = uuidv4();
        const ttl = this.envService.get('APP').JWT_REFRESH_EXPIRES_IN;

        const cacheKey = `ableRefreshToken${user.id}`;
        await this.cacheManager.set(cacheKey, resetToken, +ttl);

    }

    async confirmPasswordReset(payload: ConfirmPasswordDto): Promise<void> {
        const { userId, token, newPassword } = payload;

        const cacheKey = `ableRefreshToken${userId}`;
        const storedToken = await this.cacheManager.get(cacheKey);

        if (!storedToken || storedToken !== token) {
            throw new HttpException(
                'Invalid token',
                HttpStatus.UNAUTHORIZED
            );
        }

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new HttpException(
                'User not found',
                HttpStatus.NOT_FOUND
            );
        }

        const password = await bcrypt.hash(newPassword, 10);
        await this.userRepository.updateUser(userId, { ...user, password });
        await this.cacheManager.del(cacheKey);
    }

}
