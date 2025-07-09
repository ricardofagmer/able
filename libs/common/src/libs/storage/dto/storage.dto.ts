import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination?: string;
    filename?: string;
    path?: string;
    buffer: Buffer;
}
export class FileResponseDto {
    id: string | undefined;
    filename: string | undefined;
    originalFilename: string | undefined;
    mimetype: string | undefined;
    size: number | undefined;
    publicUrl?: string | undefined;
    isPublic: boolean | undefined;
    ownerId?: number | undefined;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
}

export class StorageBodyDto {
    @IsNotEmpty()
    @ApiProperty()
    id: string | number;

    @ApiProperty()
    @IsOptional()
    userId?: number;
}

export class StorageUploadFileDto  {
   // @IsNotEmpty()
    @ApiProperty()
    file: MulterFile

    @ApiProperty()
    //@IsBoolean()
    isPublic: boolean;

    @ApiProperty()
    //@IsString()
    folder: string;

    @ApiProperty()
    userId: number;
}
