import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
    ConfirmPasswordDto,
    LoginDto,
    LogoutDto,
    RefreshTokenDto,
    ResetPasswordDto
} from '@able/common';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

    constructor(private readonly service: AuthService) {}

    @Get('health')
    @ApiOperation({ summary: 'Health check' })
    @ApiResponse({ status: 200, description: 'Service is healthy' })
    checkHealth() {
        return { status: 'ok', message: 'Auth service is running' };
    }

    @Post('login')
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() data: LoginDto) {
        return await this.service.login(data);
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
    @ApiResponse({ status: 401, description: 'Invalid refresh token' })
    async refresh(@Body() data: RefreshTokenDto) {
        return await this.service.refreshAccessToken(data);
    }

    @Post('logout')
    @ApiOperation({ summary: 'User logout' })
    @ApiResponse({ status: 200, description: 'Logout successful' })
    async logout(@Body() data: LogoutDto) {
        await this.service.logout(data);
        return { message: 'Logout successful' };
    }

    @Post('reset-password')
    @ApiOperation({ summary: 'Request password reset' })
    @ApiResponse({ status: 200, description: 'Password reset initiated' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async resetPassword(@Body() email: ResetPasswordDto) {
        await this.service.resetPassword(email);
        return { message: 'Password reset initiated' };
    }

    @Post('confirm-reset-password')
    @ApiOperation({ summary: 'Confirm password reset' })
    @ApiResponse({ status: 200, description: 'Password reset confirmed' })
    @ApiResponse({ status: 401, description: 'Invalid reset token' })
    async confirmPassword(@Body() data: ConfirmPasswordDto) {
        await this.service.confirmPasswordReset(data);
        return { message: 'Password reset successful' };
    }

}
