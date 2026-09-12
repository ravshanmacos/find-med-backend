import { GenericModel } from 'src/core/generic.model';
import type { UUID } from 'src/common/types';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export interface IDoctor extends GenericModel {
  id: UUID;
  user_id?: UUID;
  full_name: string;
  bio?: string;
  experience_years?: number;
  is_verified: boolean;
  region_id?: number;
  district_id?: number;
}

export class Doctor extends GenericModel implements IDoctor {
  @IsNotEmpty()
  @IsUUID()
  id: UUID;

  @IsOptional()
  @IsUUID()
  user_id?: UUID;

  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsNumber()
  experience_years?: number;

  @IsBoolean()
  is_verified: boolean;

  @IsOptional()
  @IsNumber()
  region_id?: number;

  @IsOptional()
  @IsNumber()
  district_id?: number;
}
