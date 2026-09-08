import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../../core/base.service';
import { PoolService } from '../../core/pool.service';
import { wrapInTransaction } from '../../utils';
import { ERROR_MESSAGES } from '../../common/messages/error-messages';
import { SpecialtyException } from '../../common/exceptions/specialty.exceptions';
import { SpecialtiesDao } from './specialties.dao';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';

@Injectable()
export class SpecialtiesService extends BaseService {
  constructor(
    poolService: PoolService,
    private readonly specialtiesDao: SpecialtiesDao,
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
}
