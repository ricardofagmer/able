import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateEndpointDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(254)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(254)
  value: string;
}

export class UpdateEndpointDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(254)
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(254)
  value?: string;
}