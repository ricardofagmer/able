import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';


export class UserDto {

    @ApiProperty()
    id!: number;

    @ApiProperty()
    @IsNotEmpty()
    name!: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiProperty()
    @IsOptional()
    permissions?: [];

    @ApiProperty()
    @IsOptional()
    password?: string;
}

export class GetUserByIdDto {
    @ApiProperty()
    @IsNotEmpty()
    id!: number;
}

export class UserResponseDto {
    @ApiProperty()
    id!: number;

    @ApiProperty()
    @IsNotEmpty()
    name!: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @ApiProperty()
    @IsOptional()
    permissions?: any[];
}

export type UserCreateResponse = UserResponseDto;
export type GetUserByIdResponse = UserResponseDto;
