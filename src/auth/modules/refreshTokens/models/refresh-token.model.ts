import { GenericModel } from 'src/core/generic.model';
import type { UUID } from 'src/common/types';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export interface IRefreshToken extends GenericModel {
  user_id: UUID;
  token_hash: string;
  expires_at: Date;
  revoked_at?: Date;
}

export class RefreshToken extends GenericModel implements IRefreshToken {
  @IsNotEmpty()
  @IsUUID()
  user_id: UUID;

  @IsNotEmpty()
  @IsString()
  token_hash: string;

  @IsNotEmpty()
  @IsDate()
  expires_at: Date;

  @IsOptional()
  @IsDate()
  revoked_at?: Date;
}
