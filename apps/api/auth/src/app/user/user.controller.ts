import {Controller, Post, Get, Body, Param, Patch, ParseIntPipe} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import {
    UserDto,
    UserCreateResponse,
    GetUserByIdDto,
    GetUserByIdResponse,
    ConfirmAccountDto, ResendConfirmationEmailDto
} from '@able/common';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Post('create')
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    async createUserHandler(@Body() payload: UserDto): Promise<UserCreateResponse> {
        return this.userService.create(payload);
    }

    @Patch('update/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: any,
    ): Promise<any> {
        return this.userService.update(id, updateUserDto);
    }

    @Get('getAll')
    async findAll(): Promise<any[]> {
        return this.userService.getAll();
    }

    @Get('getById/:id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({ status: 200, description: 'User found' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getById(@Param('id') id: number): Promise<any> {
        return this.userService.getById(id);
    }

    @Post('confirm-account')
    @ApiOperation({ summary: 'Confirm user account' })
    @ApiResponse({ status: 200, description: 'Account confirmed successfully' })
    @ApiResponse({ status: 401, description: 'Invalid token' })
    async confirmAccount(@Body() data: ConfirmAccountDto) {
        await this.userService.confirmAccount(data);
        return { message: 'Account confirmed successfully' };
    }

    @Post('resend-confirmation')
    @ApiOperation({ summary: 'Resend confirmation email' })
    @ApiResponse({ status: 200, description: 'Confirmation email sent' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async resendEmailConfirmation(@Body() data: ResendConfirmationEmailDto) {
        await this.userService.sendConfirmationEmail(data);
        return { message: 'Confirmation email sent' };
    }

    @Post('check-exists')
    @ApiOperation({ summary: 'Check if user exists by email' })
    @ApiResponse({ status: 200, description: 'User existence check completed' })
    async checkUserExists(@Body() data: { email: string }) {
        return await this.userService.checkUserExists(data.email);
    }

}
