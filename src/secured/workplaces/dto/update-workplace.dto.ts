import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateWorkplaceDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsInt()
  regionId?: number;

  @IsOptional()
  @IsInt()
  districtId?: number;
}
