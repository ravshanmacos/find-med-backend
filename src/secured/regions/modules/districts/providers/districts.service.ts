import { GenericService } from 'src/core/generic.service';
import { PoolService } from 'src/core/pool.service';
import { Queryable } from 'src/common/constants/constants';
import { District } from '../models/district.model';
import { DistrictsDao } from './districts.dao';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DistrictsService extends GenericService<District> {
  constructor(
    protected readonly pool: PoolService,
    protected readonly dao: DistrictsDao<District>,
  ) {
    super(pool, dao);
  }

  getDefaultColumns(): string[] | Record<string, any> {
    return ['*'];
  }

  findByRegion(queryable: Queryable, regionId: number) {
    return this.dao.findByRegion(queryable, regionId);
  }
}
