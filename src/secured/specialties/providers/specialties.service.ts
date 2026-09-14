import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base.service';
import { PoolService } from 'src/core/pool.service';
import { wrapInTransaction } from 'src/utils';
import { ERROR_MESSAGES } from 'src/common/messages/error-messages';
import { SpecialtyException } from 'src/common/exceptions/specialty.exceptions';
import { SpecialtiesDao } from './specialties.dao';
import { CreateSpecialtyDto } from '../dto/create-specialty.dto';
import { Specialty } from '../models/specialty.model';
import { GenericService } from '../../../core/generic.service';

@Injectable()
export class SpecialtiesService extends GenericService<Specialty> {
  constructor(
    poolService: PoolService,
    private readonly specialtiesDao: SpecialtiesDao<Specialty>,
  ) {
    super(poolService, specialtiesDao);
  }

  list() {
    return this.specialtiesDao.findAll(this.poolService.pool, undefined, [
      'id',
      'name',
    ]);
  }

  create(dto: CreateSpecialtyDto) {
    return wrapInTransaction(this.poolService.pool, async (client) => {
      const existing = await this.specialtiesDao.findOneBy(client, {
        name: dto.name,
      });

      if (existing) {
        throw new SpecialtyException(
          ERROR_MESSAGES.SPECIALTY_ALREADY_EXISTS,
          HttpStatus.CONFLICT,
        );
      }

      return this.specialtiesDao.insert(client, { name: dto.name });
    });
  }

  getDefaultColumns(): string[] | Record<string, any> {
    throw new Error('Method not implemented.');
  }
}
