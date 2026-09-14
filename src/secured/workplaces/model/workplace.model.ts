import { GenericModel } from 'src/core/generic.model';
import type { UUID } from 'src/common/types';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export interface IWorkplace extends GenericModel {
  name: string;
  address?: string;
  phone?: string;
  region_id: number;
  district_id: number;
}

export class Workplace extends GenericModel implements IWorkplace {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNumber()
  region_id: number;

  @IsOptional()
  @IsNumber()
  district_id: number;
}
