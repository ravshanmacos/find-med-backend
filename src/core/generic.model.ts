import type { DateORString, UUID } from '../common/types';
import { IsDate, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export interface IGenericModels {
  id?: UUID;
  created_at?: DateORString;
  created_by?: UUID;
  modified_at?: DateORString;
  modified_by?: UUID;
}

export class GenericModel implements IGenericModels {
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Id of record',
    required: true,
  })
  id?: UUID;

  @IsDate()
  @ApiPropertyOptional({
    description: 'Creating date/time of record',
    required: false,
  })
  created_at?: DateORString;

  @IsDate()
  @ApiPropertyOptional({
    description: 'Last modified date/time of entity',
    required: false,
  })
  modified_at?: DateORString;

  @IsUUID()
  @ApiPropertyOptional({
    description: 'user created of entity',
    required: true,
  })
  created_by?: UUID;

  @IsUUID()
  @ApiPropertyOptional({
    description: 'Last modified entity',
    required: false,
  })
  modified_by?: UUID;
}
