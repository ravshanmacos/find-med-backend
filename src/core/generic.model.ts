import type { DateORString, UUID } from '../common/types';
import { IsDate, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export interface IGenericModels {
  created_at?: DateORString;
  created_by?: UUID;
  updated_at?: DateORString;
  updated_by?: UUID;
}

export class GenericModel implements IGenericModels {
  @IsDate()
  @ApiPropertyOptional({
    description: 'Creating date/time of record',
    required: false,
  })
  created_at?: DateORString;

  @IsUUID()
  @ApiPropertyOptional({
    description: 'user created of entity',
    required: true,
  })
  created_by?: UUID;

  @IsDate()
  @ApiPropertyOptional({
    description: 'Last modified date/time of entity',
    required: false,
  })
  updated_at?: DateORString;

  @IsUUID()
  @ApiPropertyOptional({
    description: 'Last modified entity',
    required: false,
  })
  updated_by?: UUID;
}
