import { GenericModel } from 'src/core/generic.model';
import type { UUID } from 'src/common/types';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

enum GenderType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export interface IPatient extends GenericModel {
  user_id?: UUID;
  full_name: string;
  birth_date: Date;
  gender: GenderType;
}

export class Patient extends GenericModel implements IPatient {
  @IsOptional()
  @IsUUID()
  user_id?: UUID;

  @IsNotEmpty()
  @IsDate()
  birth_date: Date;

  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsEnum(GenderType)
  gender: GenderType;
}
