import { GenericModel } from 'src/core/generic.model';
import type { UUID } from 'src/common/types';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export interface IDoctorInvite extends GenericModel {
  doctor_id: UUID;
  token_hash: string;
  expires_at: Date;
  used_at?: Date;
}

export class DoctorInvite extends GenericModel implements IDoctorInvite {
  @IsNotEmpty()
  @IsUUID()
  doctor_id: UUID;

  @IsNotEmpty()
  @IsString()
  token_hash: string;

  @IsNotEmpty()
  @IsDate()
  expires_at: Date;

  @IsOptional()
  @IsDate()
  used_at?: Date;
}
